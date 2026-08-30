from rest_framework import serializers

from wines.models import Wine
from wines.serializers import WineSerializer

from .models import CellarEntry, TastingNote


class CellarEntrySerializer(serializers.ModelSerializer):
    wine = WineSerializer(read_only=True)

    wine_id = serializers.PrimaryKeyRelatedField(
        queryset=Wine.objects.all(),
        source="wine",
        write_only=True,
    )

    class Meta:
        model = CellarEntry
        fields = [
            "id",
            "wine",
            "wine_id",
            "quantity",
            "purchase_date",
            "purchase_price",
            "storage_location",
            "personal_notes",
            "created_at",
            "updated_at",
        ]


class TastingNoteSerializer(serializers.ModelSerializer):
    wine = WineSerializer(read_only=True)

    wine_id = serializers.PrimaryKeyRelatedField(
        queryset=Wine.objects.all(),
        source="wine",
        write_only=True,
    )

    class Meta:
        model = TastingNote
        fields = [
            "id",
            "wine",
            "wine_id",
            "rating",
            "notes",
            "tasted_on",
            "created_at",
            "updated_at",
        ]