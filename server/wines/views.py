import requests

from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Region, Winery, Wine
from .serializers import RegionSerializer, WinerySerializer, WineSerializer

from .services.wine_api import (
    get_wine_details,
    normalize_wine_details,
    search_wines,
)


# Create your views here.
class WineryListView(generics.ListCreateAPIView):
    queryset = Winery.objects.all().order_by("name")
    serializer_class = WinerySerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return []

        return [IsAdminUser()]


class WineryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Winery.objects.all()
    serializer_class = WinerySerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return []

        return [IsAdminUser()]


class RegionListView(generics.ListCreateAPIView):
    queryset = Region.objects.all().order_by("name")
    serializer_class = RegionSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return []

        return [IsAdminUser()]


class RegionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return []

        return [IsAdminUser()]


class WineListView(generics.ListCreateAPIView):
    queryset = Wine.objects.all().order_by("name")
    serializer_class = WineSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return []

        return [IsAdminUser()]


class WineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Wine.objects.all()
    serializer_class = WineSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return []

        return [IsAdminUser()]


class ExternalWineSearchView(APIView):
    permission_classes = []

    def get(self, request):
        query = request.query_params.get("q", "").strip()

        if not query:
            return Response(
                {"error": "Search query is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            results = search_wines(query)
        except requests.RequestException:
            return Response(
                {"error": "External wine search is currently unavailable."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(results)


class ExternalWineDetailView(APIView):
    permission_classes = []

    def get(self, request, external_id):
        try:
            wine = get_wine_details(external_id)
        except requests.RequestException:
            return Response(
                {"error": "External wine details are currently unavailable."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        normalized_wine = normalize_wine_details(wine)

        return Response(normalized_wine)


class ExternalWineImportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, external_id):
        existing_wine = Wine.objects.filter(
            external_source="wineapi",
            external_api_id=external_id,
        ).first()

        if existing_wine:
            serializer = WineSerializer(existing_wine)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        try:
            raw_wine = get_wine_details(external_id)
        except requests.RequestException:
            return Response(
                {"error": "External wine details are currently unavailable."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        wine_data = normalize_wine_details(raw_wine)

        winery = None
        if wine_data["winery"]:
            winery, _ = Winery.objects.get_or_create(
                name=wine_data["winery"],
                defaults={
                    "country": wine_data["country"],
                },
            )

        region = None
        if wine_data["region"]:
            region, _ = Region.objects.get_or_create(
                name=wine_data["region"],
                country=wine_data["country"],
            )

        wine = Wine.objects.create(
            name=wine_data["name"],
            vintage=wine_data["vintage"],
            wine_type=wine_data["wine_type"],
            varietal=wine_data["varietal"],
            description=wine_data["description"],
            image_url=wine_data["image_url"],
            body=wine_data["body"],
            acidity=wine_data["acidity"],
            alcohol_content=wine_data["alcohol_content"],
            winery=winery,
            region=region,
            external_api_id=wine_data["external_api_id"],
            external_source=wine_data["external_source"],
        )

        serializer = WineSerializer(wine)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )