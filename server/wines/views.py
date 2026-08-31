from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from .models import Region, Winery, Wine
from .serializers import RegionSerializer, WinerySerializer, WineSerializer


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