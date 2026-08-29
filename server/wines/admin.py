from django.contrib import admin

from .models import Region, Wine, Winery

# Register your models here.
admin.site.register(Winery)
admin.site.register(Region)
admin.site.register(Wine)