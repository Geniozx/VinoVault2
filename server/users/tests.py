from django.test import TestCase

# Create your tests here.
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class RegistrationTests(APITestCase):
    def test_user_can_register(self):
        url = reverse("register")

        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "strongpassword123",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

        user = User.objects.get(username="testuser")

        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("strongpassword123"))


    def test_registration_rejects_short_password(self):
        url = reverse("register")

        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "short",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
        self.assertIn("password", response.data)


    def test_registration_rejects_duplicate_username(self):
        User.objects.create_user(
            username="testuser",
            email="existing@example.com",
            password="strongpassword123",
        )

        url = reverse("register")

        data = {
            "username": "testuser",
            "email": "new@example.com",
            "password": "anotherpassword123",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertIn("username", response.data)


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="strongpassword123",
        )
    
    def test_user_can_login_and_receive_tokens(self):
        url = reverse("token_obtain_pair")
    
        data = {
            "username": "testuser",
            "password": "strongpassword123",
        }
    
        response = self.client.post(url, data, format="json")
    
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)


    def test_login_rejects_invalid_credentials(self):
        url = reverse("token_obtain_pair")

        data = {
            "username": "testuser",
            "password": "wrongpassword",
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn("access", response.data)
        self.assertNotIn("refresh", response.data)


    def test_refresh_token_returns_new_access_token(self):
        login_url = reverse("token_obtain_pair")

        login_data = {
            "username": "testuser",
            "password": "strongpassword123",
        }

        login_response = self.client.post(
            login_url,
            login_data,
            format="json",
        )

        refresh_token = login_response.data["refresh"]

        refresh_url = reverse("token_refresh")

        response = self.client.post(
            refresh_url,
            {"refresh": refresh_token},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)


    def test_authenticated_user_can_get_current_user(self):
        self.client.force_authenticate(user=self.user)

        url = reverse("current-user")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.user.id)
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(response.data["email"], "test@example.com")


    def test_unauthenticated_user_cannot_get_current_user(self):
        url = reverse("current-user")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )


    def test_authenticated_user_can_logout(self):
        login_url = reverse("token_obtain_pair")

        login_response = self.client.post(
            login_url,
            {
                "username": "testuser",
                "password": "strongpassword123",
            },
            format="json",
        )

        refresh_token = login_response.data["refresh"]

        self.client.force_authenticate(user=self.user)

        logout_url = reverse("logout")

        response = self.client.post(
            logout_url,
            {"refresh": refresh_token},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["detail"],
            "Logged out successfully.",
        )


    def test_logged_out_refresh_token_cannot_be_reused(self):
        login_url = reverse("token_obtain_pair")

        login_response = self.client.post(
            login_url,
            {
                "username": "testuser",
                "password": "strongpassword123",
            },
            format="json",
        )

        refresh_token = login_response.data["refresh"]

        self.client.force_authenticate(user=self.user)

        logout_url = reverse("logout")

        logout_response = self.client.post(
            logout_url,
            {"refresh": refresh_token},
            format="json",
        )

        self.assertEqual(
            logout_response.status_code,
            status.HTTP_200_OK,
        )

        self.client.force_authenticate(user=None)

        refresh_url = reverse("token_refresh")

        refresh_response = self.client.post(
            refresh_url,
            {"refresh": refresh_token},
            format="json",
        )

        self.assertEqual(
            refresh_response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )



    def test_logout_requires_refresh_token(self):
        self.client.force_authenticate(user=self.user)

        url = reverse("logout")

        response = self.client.post(
            url,
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(
            response.data["detail"],
            "Refresh token is required.",
        )


    def test_logout_rejects_invalid_refresh_token(self):
        self.client.force_authenticate(user=self.user)

        url = reverse("logout")

        response = self.client.post(
            url,
            {"refresh": "this-is-not-a-valid-refresh-token"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(
            response.data["detail"],
            "Invalid refresh token.",
        )