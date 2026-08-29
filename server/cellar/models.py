from django.conf import settings
from django.db import models

from wines.models import Wine


# Create your models here.
class CellarEntry(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cellar_entries",
    )

    wine = models.ForeignKey(
        Wine,
        on_delete=models.CASCADE,
        related_name="cellar_entries",
    )

    quantity = models.PositiveIntegerField(default=1)

    purchase_date = models.DateField(
        null=True,
        blank=True,
    )

    purchase_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    storage_location = models.CharField(
        max_length=255,
        blank=True,
    )

    personal_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "wine"],
                name="unique_user_wine",
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.wine.name}"



class TastingNote(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasting_notes",
    )

    wine = models.ForeignKey(
        Wine,
        on_delete=models.CASCADE,
        related_name="tasting_notes",
    )

    rating = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
    )

    notes = models.TextField()

    tasted_on = models.DateField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.wine.name}"



