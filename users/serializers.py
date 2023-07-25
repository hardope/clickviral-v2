from rest_framework.serializers import ModelSerializer

from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(ModelSerializer):
     class Meta:
          model = User
          fields = '__all__'
          extra_kwargs = {'password':{'write_only':True,'required':True}, 'email':{'required':True}}
     
     def create(self, validated_data):
          
          user = User.objects.create_user(**validated_data)
          profile = Profile.objects.create(user=user)
          return user

class ProfileSerializer(ModelSerializer):
     class Meta:
          model = Profile
          fields = '__all__'
     
     def create(self, validated_data):
          profile = Profile.objects.create(**validated_data)
          return profile
