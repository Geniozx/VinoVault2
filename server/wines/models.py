from django.db import models

# Create your models here.
class Winery(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Region(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}, {self.country}"


class Wine(models.Model):
    WINE_TYPES = [
        ("red", "Red"),
        ("white", "White"),
        ("rose", "Rosé"),
        ("sparkling", "Sparkling"),
        ("dessert", "Dessert"),
        ("fortified", "Fortified"),
    ]

    name = models.CharField(max_length=255)
    vintage = models.PositiveIntegerField(null=True, blank=True)
    wine_type = models.CharField(
        max_length=20,
        choices=WINE_TYPES,
    )
    varietal = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)

    winery = models.ForeignKey(
        Winery,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="wines",
    )

    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="wines",
    )

    external_api_id = models.CharField(
        max_length=255,
        blank=True,
    )

    external_source = models.CharField(
        max_length=100,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.vintage:
            return f"{self.name} ({self.vintage})"

        return self.name


