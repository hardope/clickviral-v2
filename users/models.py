from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4


# Create your models here.
app_name = 'users'

def user_directory_path(instance, filename):

     return f'media/profiles/{instance.user.username}/{uuid4()}.{filename.split(".")[-1]}'

class Profile(models.Model):
     user = models.OneToOneField(User, on_delete=models.CASCADE)
     bio = models.TextField(max_length=500, blank=True)
     location = models.CharField(max_length=30, blank=True)
     birth_date = models.DateField(null=True, blank=True)
     image = models.ImageField(upload_to=user_directory_path, blank=True)
     cover = models.ImageField(upload_to=user_directory_path, blank=True)

     def __str__(self) -> str:
          return f'{self.user.username} Profile'

     class Meta:
          verbose_name = 'Profile'
          verbose_name_plural = 'Profiles'
          ordering = ['user__username']
