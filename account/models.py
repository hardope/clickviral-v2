from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4

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
