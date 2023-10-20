from django.contrib import admin
from .models import Profile, Account, Preferences, Image

# Register your models here.

admin.site.register(Profile)
admin.site.register(Account)
admin.site.register(Preferences)
admin.site.register(Image)
