from django.contrib import admin

from .models import CellarEntry, TastingNote

# Register your models here.
admin.site.register(CellarEntry)
admin.site.register(TastingNote)