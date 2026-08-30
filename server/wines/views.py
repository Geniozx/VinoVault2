from rest_framework import generics

from .models import Region, Winery, Wine
from .serializers import RegionSerializer, WinerySerializer, WineSerializer

# Create your views here.
from rest_framework import generics

from .models import Region, Winery
from .serializers import RegionSerializer, WinerySerializer


class WineryListView(generics.ListAPIView):
    queryset = Winery.objects.all().order_by("name")
    serializer_class = WinerySerializer


class WineryDetailView(generics.RetrieveAPIView):
    queryset = Winery.objects.all()
    serializer_class = WinerySerializer


class RegionListView(generics.ListAPIView):
    queryset = Region.objects.all().order_by("name")
    serializer_class = RegionSerializer


class RegionDetailView(generics.RetrieveAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class WineListView(generics.ListAPIView):
    queryset = Wine.objects.all().order_by("name")
    serializer_class = WineSerializer


class WineDetailView(generics.RetrieveAPIView):
    queryset = Wine.objects.all()
    serializer_class = WineSerializer