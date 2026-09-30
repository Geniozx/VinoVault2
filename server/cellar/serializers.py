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

    def validate(self, attrs):
        request = self.context.get("request")
        wine = attrs.get("wine")

        if request and wine:
            existing_entries = CellarEntry.objects.filter(
                user=request.user,
                wine=wine,
            )

            if self.instance:
                existing_entries = existing_entries.exclude(
                    pk=self.instance.pk
                )

            if existing_entries.exists():
                raise serializers.ValidationError(
                    {
                        "wine_id": (
                            "This wine is already in your cellar."
                        )
                    }
                )

        return attrs


class TastingNoteSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(
        min_value=1,
        max_value=5,
        required=False,
        allow_null=True,
    )
    
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