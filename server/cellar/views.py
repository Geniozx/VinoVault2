from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import CellarEntry, TastingNote
from .serializers import CellarEntrySerializer, TastingNoteSerializer


# Create your views here.
class CellarEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = CellarEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CellarEntry.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CellarEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CellarEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CellarEntry.objects.filter(
            user=self.request.user
        )


class TastingNoteListCreateView(generics.ListCreateAPIView):
    serializer_class = TastingNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TastingNote.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TastingNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TastingNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TastingNote.objects.filter(
            user=self.request.user
        )