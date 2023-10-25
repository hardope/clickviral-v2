from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4

def profile_image_path(instance, filename):
    return f'media/profile/{instance.user.username}/{filename}'

class Profile(User):

    bio = models.TextField(max_length=200, blank=True)
    location = models.TextField(max_length=50, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.username
    
    class Meta:

        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'
        ordering = ['username']

class Preferences(models.Model):

    theme_options = (
        ('light', 'Light'),
        ('dark', 'Dark'),
    )

    birthday_display_preference = (
        ('y', 'Yes'),
        ('n', 'No'),
    )

    birth_date_display_preference = (
        ('y', 'Yes'),
        ('n', 'No'),
    )

    user = models.OneToOneField(Profile, on_delete=models.CASCADE)
    theme = models.CharField(max_length=5, choices=theme_options, default='light')
    display_age = models.CharField(max_length=1, choices=birthday_display_preference, default='y')
    display_birth_date = models.CharField(max_length=1, choices=birth_date_display_preference, default='y')
    chat_notifications_mail = models.BooleanField(default=True)
    comment_notifications_mail = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username

class Image(models.Model):

    type = (
        ('profile', 'Profile'),
        ('cover', 'Cover')
    )

    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=profile_image_path)
    image_type = models.CharField(max_length=10, choices=type, default='profile')
