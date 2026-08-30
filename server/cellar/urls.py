from django.urls import path

from .views import (
    CellarEntryDetailView,
    CellarEntryListCreateView,
    TastingNoteDetailView,
    TastingNoteListCreateView,
)


urlpatterns = [
    path(
        "cellar/",
        CellarEntryListCreateView.as_view(),
        name="cellar-list-create",
    ),
    path(
        "cellar/<int:pk>/",
        CellarEntryDetailView.as_view(),
        name="cellar-detail",
    ),

    path(
        "tasting-notes/",
        TastingNoteListCreateView.as_view(),
        name="tasting-note-list-create",
    ),
    path(
        "tasting-notes/<int:pk>/",
        TastingNoteDetailView.as_view(),
        name="tasting-note-detail",
    ),
]

