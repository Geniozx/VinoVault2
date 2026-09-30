from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
import requests

from .models import Region, Wine, Winery

User = get_user_model()

class WineCatalogTests(APITestCase):
    def test_unauthenticated_user_can_view_wine_list(self):
        url = reverse("wine-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def setUp(self):
        self.winery = Winery.objects.create(
            name="Test Winery",
            country="USA",
        )

        self.region = Region.objects.create(
            name="Napa Valley",
            country="USA",
        )

        self.wine = Wine.objects.create(
            name="Test Cabernet",
            vintage=2022,
            wine_type="red",
            varietal="Cabernet Sauvignon",
            winery=self.winery,
            region=self.region,
        )



    def test_public_wine_list_returns_catalog_data(self):
        url = reverse("wine-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Test Cabernet")
        self.assertEqual(response.data[0]["vintage"], 2022)
        self.assertEqual(response.data[0]["wine_type"], "red")
        self.assertEqual(
            response.data[0]["varietal"],
            "Cabernet Sauvignon",
        )



    def test_unauthenticated_user_can_view_wine_detail(self):
        url = reverse(
            "wine-detail",
            kwargs={"pk": self.wine.pk},
        )

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.wine.id)
        self.assertEqual(response.data["name"], "Test Cabernet")
        self.assertEqual(response.data["vintage"], 2022)
        self.assertEqual(response.data["wine_type"], "red")


    def test_wine_detail_returns_404_for_invalid_id(self):
        url = reverse(
            "wine-detail",
            kwargs={"pk": 99999},
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )


    def test_unauthenticated_user_cannot_create_wine(self):
        url = reverse("wine-list")

        data = {
            "name": "Unauthorized Wine",
            "vintage": 2023,
            "wine_type": "red",
            "varietal": "Merlot",
        }

        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        self.assertFalse(
            Wine.objects.filter(name="Unauthorized Wine").exists()
        )


    def test_regular_user_cannot_create_wine(self):
        user = User.objects.create_user(
            username="regularuser",
            email="regular@example.com",
            password="strongpassword123",
        )

        self.client.force_authenticate(user=user)

        url = reverse("wine-list")

        data = {
            "name": "Unauthorized Wine",
            "vintage": 2023,
            "wine_type": "red",
            "varietal": "Merlot",
        }

        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

        self.assertFalse(
            Wine.objects.filter(name="Unauthorized Wine").exists()
        )


    def test_admin_user_can_create_wine(self):
        admin = User.objects.create_superuser(
            username="adminuser",
            email="admin@example.com",
            password="strongpassword123",
        )

        self.client.force_authenticate(user=admin)

        url = reverse("wine-list")

        data = {
            "name": "Admin Cabernet",
            "vintage": 2023,
            "wine_type": "red",
            "varietal": "Cabernet Sauvignon",
            "winery_id": self.winery.id,
            "region_id": self.region.id,
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

        self.assertTrue(
            Wine.objects.filter(name="Admin Cabernet").exists()
        )


    def test_unauthenticated_user_can_view_winery_list(self):
        url = reverse("winery-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Test Winery")
        self.assertEqual(response.data[0]["country"], "USA")


    def test_unauthenticated_user_can_view_winery_list(self):
        url = reverse("winery-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Test Winery")
        self.assertEqual(response.data[0]["country"], "USA")



    def test_unauthenticated_user_can_view_region_list(self):
        url = reverse("region-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Napa Valley")
        self.assertEqual(response.data[0]["country"], "USA")




class ExternalWineTests(APITestCase):
    def test_external_wine_search_requires_query(self):
        url = reverse("external-wine-search")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(
            response.data["error"],
            "Search query is required.",
        )


    @patch("wines.views.search_wines")
    def test_external_wine_search_returns_provider_results(
        self,
        mock_search_wines,
    ):
        mock_search_wines.return_value = [
            {
                "id": "wine-123",
                "name": "External Cabernet",
            }
        ]

        url = reverse("external-wine-search")

        response = self.client.get(
            url,
            {"q": "cabernet"},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(
            response.data,
            [
                {
                    "id": "wine-123",
                    "name": "External Cabernet",
                }
            ],
        )

        mock_search_wines.assert_called_once_with("cabernet")



    @patch("wines.views.search_wines")
    def test_external_wine_search_handles_provider_failure(
        self,
        mock_search_wines,
    ):
        mock_search_wines.side_effect = requests.RequestException(
            "Provider unavailable"
        )

        url = reverse("external-wine-search")

        response = self.client.get(
            url,
            {"q": "cabernet"},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_502_BAD_GATEWAY,
        )
        self.assertEqual(
            response.data["error"],
            "External wine search is currently unavailable.",
        )

        mock_search_wines.assert_called_once_with("cabernet")


    @patch("wines.views.get_wine_details")
    def test_external_wine_detail_returns_normalized_data(
        self,
        mock_get_wine_details,
    ):
        mock_get_wine_details.return_value = {
            "id": "wine-123",
            "name": "External Cabernet",
            "vintage": 2021,
            "type": "red",
            "winery": {
                "name": "External Winery",
            },
            "region": {
                "name": "Napa Valley",
                "country": "USA",
            },
            "grapes": [
                {
                    "name": "Cabernet Sauvignon",
                }
            ],
            "description": "A test Cabernet.",
            "imageUrl": "https://example.com/wine.jpg",
            "body": "full",
            "acidity": "medium",
            "alcoholContent": 14.5,
            "averageRating": 4.3,
            "ratingsCount": 250,
            "pairings": [
                {"food": "Steak"},
                {"food": "Lamb"},
            ],
        }

        url = reverse(
            "external-wine-detail",
            kwargs={"external_id": "wine-123"},
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(
            response.data["external_api_id"],
            "wine-123",
        )
        self.assertEqual(
            response.data["external_source"],
            "wineapi",
        )
        self.assertEqual(
            response.data["name"],
            "External Cabernet",
        )
        self.assertEqual(
            response.data["varietal"],
            "Cabernet Sauvignon",
        )
        self.assertEqual(
            response.data["winery"],
            "External Winery",
        )
        self.assertEqual(
            response.data["region"],
            "Napa Valley",
        )
        self.assertEqual(
            response.data["pairings"],
            ["Steak", "Lamb"],
        )

        mock_get_wine_details.assert_called_once_with("wine-123")


    @patch("wines.views.get_wine_details")
    def test_external_wine_detail_handles_provider_failure(
        self,
        mock_get_wine_details,
    ):
        mock_get_wine_details.side_effect = requests.RequestException(
            "Provider unavailable"
        )

        url = reverse(
            "external-wine-detail",
            kwargs={"external_id": "wine-123"},
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_502_BAD_GATEWAY,
        )
        self.assertEqual(
            response.data["error"],
            "External wine details are currently unavailable.",
        )

        mock_get_wine_details.assert_called_once_with("wine-123")


    def test_external_wine_import_requires_authentication(self):
        url = reverse(
            "external-wine-import",
            kwargs={"external_id": "wine-123"},
        )

        response = self.client.post(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        self.assertFalse(
            Wine.objects.filter(
                external_api_id="wine-123",
                external_source="wineapi",
            ).exists()
        )


    @patch("wines.views.get_wine_details")
    def test_authenticated_user_can_import_external_wine(
        self,
        mock_get_wine_details,
    ):
        user = User.objects.create_user(
            username="importuser",
            email="import@example.com",
            password="strongpassword123",
        )

        self.client.force_authenticate(user=user)

        mock_get_wine_details.return_value = {
            "id": "wine-123",
            "name": "Imported Cabernet",
            "vintage": 2021,
            "type": "red",
            "winery": {
                "name": "Import Winery",
            },
            "region": {
                "name": "Napa Valley",
                "country": "USA",
            },
            "grapes": [
                {
                    "name": "Cabernet Sauvignon",
                }
            ],
            "description": "A full-bodied Cabernet.",
            "imageUrl": "https://example.com/imported-wine.jpg",
            "body": "full",
            "acidity": "medium",
            "alcoholContent": 14.5,
        }

        url = reverse(
            "external-wine-import",
            kwargs={"external_id": "wine-123"},
        )

        response = self.client.post(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        wine = Wine.objects.get(
            external_api_id="wine-123",
            external_source="wineapi",
        )

        self.assertEqual(wine.name, "Imported Cabernet")
        self.assertEqual(wine.vintage, 2021)
        self.assertEqual(wine.wine_type, "red")
        self.assertEqual(wine.varietal, "Cabernet Sauvignon")
        self.assertEqual(wine.body, "full")
        self.assertEqual(wine.acidity, "medium")
        self.assertEqual(wine.winery.name, "Import Winery")
        self.assertEqual(wine.region.name, "Napa Valley")

        mock_get_wine_details.assert_called_once_with("wine-123")


    @patch("wines.views.get_wine_details")
    def test_duplicate_external_wine_import_returns_existing_wine(
        self,
        mock_get_wine_details,
    ):
        user = User.objects.create_user(
            username="importuser",
            email="import@example.com",
            password="strongpassword123",
        )

        self.client.force_authenticate(user=user)

        existing_wine = Wine.objects.create(
            name="Existing Cabernet",
            vintage=2021,
            wine_type="red",
            varietal="Cabernet Sauvignon",
            external_api_id="wine-123",
            external_source="wineapi",
        )

        url = reverse(
            "external-wine-import",
            kwargs={"external_id": "wine-123"},
        )

        response = self.client.post(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            Wine.objects.filter(
                external_api_id="wine-123",
                external_source="wineapi",
            ).count(),
            1,
        )

        self.assertEqual(
            response.data["id"],
            existing_wine.id,
        )

        mock_get_wine_details.assert_not_called()


    @patch("wines.views.get_wine_details")
    def test_external_wine_import_handles_provider_failure(
        self,
        mock_get_wine_details,
    ):
        user = User.objects.create_user(
            username="importuser",
            email="import@example.com",
            password="strongpassword123",
        )

        self.client.force_authenticate(user=user)

        mock_get_wine_details.side_effect = requests.RequestException(
            "Provider unavailable"
        )

        url = reverse(
            "external-wine-import",
            kwargs={"external_id": "wine-123"},
        )

        response = self.client.post(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_502_BAD_GATEWAY,
        )

        self.assertFalse(
            Wine.objects.filter(
                external_api_id="wine-123",
                external_source="wineapi",
            ).exists()
        )

        mock_get_wine_details.assert_called_once_with("wine-123")