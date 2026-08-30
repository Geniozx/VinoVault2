from django.urls import path

from .views import (
    RegionDetailView,
    RegionListView,
    WineryDetailView,
    WineryListView,
    WineDetailView,
    WineListView,
)


urlpatterns = [
    path("wineries/", WineryListView.as_view(), name="winery-list"),
    path("wineries/<int:pk>/", WineryDetailView.as_view(), name="winery-detail"),

    path("regions/", RegionListView.as_view(), name="region-list"),
    path("regions/<int:pk>/", RegionDetailView.as_view(), name="region-detail"),

    path("wines/", WineListView.as_view(), name="wine-list"),
    path("wines/<int:pk>/", WineDetailView.as_view(), name="wine-detail"),
]