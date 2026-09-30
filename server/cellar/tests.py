from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from wines.models import Wine
from .models import CellarEntry, TastingNote

User = get_user_model()


class CellarEntryTests(APITestCase):
    def test_unauthenticated_user_cannot_view_cellar(self):
        url = reverse("cellar-list-create")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )


    def setUp(self):
        self.user_one = User.objects.create_user(
            username="userone",
            email="userone@example.com",
            password="strongpassword123",
        )

        self.user_two = User.objects.create_user(
            username="usertwo",
            email="usertwo@example.com",
            password="strongpassword123",
        )

        self.wine_one = Wine.objects.create(
            name="User One Cabernet",
            wine_type="red",
        )

        self.wine_two = Wine.objects.create(
            name="User Two Chardonnay",
            wine_type="white",
        )

        self.entry_one = CellarEntry.objects.create(
            user=self.user_one,
            wine=self.wine_one,
            quantity=2,
        )

        self.entry_two = CellarEntry.objects.create(
            user=self.user_two,
            wine=self.wine_two,
            quantity=3,
        )


    def test_user_only_sees_their_own_cellar_entries(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse("cellar-list-create")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["id"],
            self.entry_one.id,
        )
        self.assertEqual(
            response.data[0]["wine"]["name"],
            "User One Cabernet",
        )


    def test_authenticated_user_can_create_cellar_entry(self):
        self.client.force_authenticate(user=self.user_one)

        new_wine = Wine.objects.create(
            name="New Merlot",
            wine_type="red",
        )

        url = reverse("cellar-list-create")

        data = {
            "wine_id": new_wine.id,
            "quantity": 4,
            "storage_location": "Wine Rack",
            "personal_notes": "Save for dinner.",
        }

        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        entry = CellarEntry.objects.get(wine=new_wine)

        self.assertEqual(entry.user, self.user_one)
        self.assertEqual(entry.quantity, 4)
        self.assertEqual(entry.storage_location, "Wine Rack")
        self.assertEqual(
            entry.personal_notes,
            "Save for dinner.",
        )


    def test_user_cannot_access_another_users_cellar_entry(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse(
            "cellar-detail",
            kwargs={"pk": self.entry_two.pk},
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )


    def test_user_cannot_update_another_users_cellar_entry(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse(
            "cellar-detail",
            kwargs={"pk": self.entry_two.pk},
        )

        response = self.client.patch(
            url,
            {"quantity": 99},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        self.entry_two.refresh_from_db()

        self.assertEqual(self.entry_two.quantity, 3)



    def test_user_cannot_delete_another_users_cellar_entry(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse(
            "cellar-detail",
            kwargs={"pk": self.entry_two.pk},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        self.assertTrue(
            CellarEntry.objects.filter(
                pk=self.entry_two.pk,
            ).exists()
        )


    def test_user_can_update_their_own_cellar_entry(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse(
            "cellar-detail",
            kwargs={"pk": self.entry_one.pk},
        )

        response = self.client.patch(
            url,
            {
                "quantity": 5,
                "storage_location": "Cellar Shelf A",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.entry_one.refresh_from_db()

        self.assertEqual(self.entry_one.quantity, 5)
        self.assertEqual(
            self.entry_one.storage_location,
            "Cellar Shelf A",
        )


    def test_user_can_delete_their_own_cellar_entry(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse(
            "cellar-detail",
            kwargs={"pk": self.entry_one.pk},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            CellarEntry.objects.filter(
                pk=self.entry_one.pk,
            ).exists()
        )


    def test_user_cannot_add_same_wine_to_cellar_twice(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse("cellar-list-create")

        data = {
            "wine_id": self.wine_one.id,
            "quantity": 5,
        }

        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(
            CellarEntry.objects.filter(
                user=self.user_one,
                wine=self.wine_one,
            ).count(),
            1,
        )



class TastingNoteTests(APITestCase):
    def test_unauthenticated_user_cannot_view_tasting_notes(self):
        url = reverse("tasting-note-list-create")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )


    def setUp(self):
        self.user_one = User.objects.create_user(
            username="noteuserone",
            email="noteuserone@example.com",
            password="strongpassword123",
        )

        self.user_two = User.objects.create_user(
            username="noteusertwo",
            email="noteusertwo@example.com",
            password="strongpassword123",
        )

        self.wine_one = Wine.objects.create(
            name="Tasting Cabernet",
            wine_type="red",
        )

        self.wine_two = Wine.objects.create(
            name="Tasting Chardonnay",
            wine_type="white",
        )

        self.note_one = TastingNote.objects.create(
            user=self.user_one,
            wine=self.wine_one,
            rating=5,
            notes="Rich and balanced.",
        )

        self.note_two = TastingNote.objects.create(
            user=self.user_two,
            wine=self.wine_two,
            rating=4,
            notes="Bright and crisp.",
        )


    def test_user_only_sees_their_own_tasting_notes(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse("tasting-note-list-create")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["id"],
            self.note_one.id,
        )
        self.assertEqual(
            response.data[0]["wine"]["name"],
            "Tasting Cabernet",
        )
        self.assertEqual(
            response.data[0]["notes"],
            "Rich and balanced.",
        )



    def test_authenticated_user_can_create_tasting_note(self):
        self.client.force_authenticate(user=self.user_one)

        new_wine = Wine.objects.create(
            name="Tasting Merlot",
            wine_type="red",
        )

        url = reverse("tasting-note-list-create")

        data = {
            "wine_id": new_wine.id,
            "rating": 4,
            "notes": "Smooth with dark fruit.",
            "tasted_on": "2026-09-18",
        }

        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        note = TastingNote.objects.get(wine=new_wine)

        self.assertEqual(note.user, self.user_one)
        self.assertEqual(note.rating, 4)
        self.assertEqual(
            note.notes,
            "Smooth with dark fruit.",
        )


    def test_user_cannot_view_another_users_tasting_note(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse(
            "tasting-note-detail",
            kwargs={"pk": self.note_two.id},
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )


    def test_user_cannot_update_another_users_tasting_note(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse(
            "tasting-note-detail",
            kwargs={"pk": self.note_two.id},
        )

        response = self.client.patch(
            url,
            {
                "rating": 1,
                "notes": "This should not be saved.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        self.note_two.refresh_from_db()

        self.assertEqual(self.note_two.rating, 4)
        self.assertEqual(
            self.note_two.notes,
            "Bright and crisp.",
        )


    def test_user_cannot_delete_another_users_tasting_note(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse(
            "tasting-note-detail",
            kwargs={"pk": self.note_two.id},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        self.assertTrue(
            TastingNote.objects.filter(
                pk=self.note_two.id
            ).exists()
        )


    def test_user_can_update_own_tasting_note(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse(
            "tasting-note-detail",
            kwargs={"pk": self.note_one.id},
        )

        response = self.client.patch(
            url,
            {
                "rating": 3,
                "notes": "Better after some time in the glass.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.note_one.refresh_from_db()

        self.assertEqual(self.note_one.rating, 3)
        self.assertEqual(
            self.note_one.notes,
            "Better after some time in the glass.",
        )


    def test_user_can_delete_own_tasting_note(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse(
            "tasting-note-detail",
            kwargs={"pk": self.note_one.id},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.assertFalse(
            TastingNote.objects.filter(
                pk=self.note_one.id
            ).exists()
        )


    def test_cannot_create_tasting_note_with_invalid_wine(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse("tasting-note-list-create")

        data = {
            "wine_id": 999999,
            "rating": 4,
            "notes": "This should not be created.",
        }

        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("wine_id", response.data)

        self.assertEqual(
            TastingNote.objects.filter(
                user=self.user_one
            ).count(),
            1,
        )


    def test_cannot_create_tasting_note_with_rating_above_five(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse("tasting-note-list-create")

        data = {
            "wine_id": self.wine_two.id,
            "rating": 6,
            "notes": "Invalid rating test.",
        }

        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("rating", response.data)

        self.assertFalse(
            TastingNote.objects.filter(
                user=self.user_one,
                wine=self.wine_two,
            ).exists()
        )


    def test_cannot_create_tasting_note_with_rating_below_one(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse("tasting-note-list-create")

        data = {
            "wine_id": self.wine_two.id,
            "rating": 0,
            "notes": "Invalid rating test.",
        }

        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("rating", response.data)

        self.assertFalse(
            TastingNote.objects.filter(
                user=self.user_one,
                wine=self.wine_two,
            ).exists()
        )


    def test_cannot_create_tasting_note_without_notes(self):
        self.client.force_authenticate(user=self.user_one)

        url = reverse("tasting-note-list-create")

        data = {
            "wine_id": self.wine_two.id,
            "rating": 4,
        }

        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn("notes", response.data)

        self.assertFalse(
            TastingNote.objects.filter(
                user=self.user_one,
                wine=self.wine_two,
            ).exists()
        )