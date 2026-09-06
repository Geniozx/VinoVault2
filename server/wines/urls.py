from django.urls import path

from .views import (
    ExternalWineSearchView,
    ExternalWineDetailView,
    ExternalWineImportView,
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

    path(
        "external-wines/search/",
        ExternalWineSearchView.as_view(),
        name="external-wine-search",
    ),

    path(
        "external-wines/<str:external_id>/",
        ExternalWineDetailView.as_view(),
        name="external-wine-detail",
    ),

    path(
    "external-wines/<str:external_id>/import/",
    ExternalWineImportView.as_view(),
    name="external-wine-import",
),
]