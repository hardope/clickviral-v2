from django.db import models
from django.contrib.auth.models import User

# Create your models here.
app_name = 'users'

class Profile(models.Model):
     user = models.OneToOneField(User, on_delete=models.CASCADE)
     bio = models.TextField(max_length=500, blank=True)
     location = models.CharField(max_length=30, blank=True)
     birth_date = models.DateField(null=True, blank=True)
     image = models.ImageField(upload_to=f'profiles/{User.username}/', blank=True)

     def __str__(self) -> str:
          return f'{self.user.username} Profile'

     class Meta:
          verbose_name = 'Profile'
          verbose_name_plural = 'Profiles'
          ordering = ['user__username']
