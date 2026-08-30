from rest_framework import serializers

from .models import Region, Wine, Winery


class WinerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Winery
        fields = [
            "id",
            "name",
            "country",
            "website",
            "created_at",
        ]


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = [
            "id",
            "name",
            "country",
        ]


class WineSerializer(serializers.ModelSerializer):
    winery = WinerySerializer(read_only=True)
    region = RegionSerializer(read_only=True)

    winery_id = serializers.PrimaryKeyRelatedField(
        queryset=Winery.objects.all(),
        source="winery",
        write_only=True,
        required=False,
        allow_null=True,
    )

    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(),
        source="region",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Wine
        fields = [
            "id",
            "name",
            "vintage",
            "wine_type",
            "varietal",
            "description",
            "image_url",
            "winery",
            "winery_id",
            "region",
            "region_id",
            "external_api_id",
            "external_source",
            "created_at",
            "updated_at",
        ]