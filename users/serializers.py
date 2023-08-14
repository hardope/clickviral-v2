from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from .models import UserProfile as User

class UserSerializer(ModelSerializer):
     class Meta:
          model = User
          fields = '__all__'
          extra_kwargs = {'password':{'write_only':True,'required':True}, 'email':{'required':True}}
     
     def create(self, validated_data):
          
          user = User.objects.create_user(**validated_data)
          return user

     def validate(self, data):

          if self.context['request'].method == 'POST':
               if User.objects.filter(email=data['email']).exists():
                    raise serializers.ValidationError('Email already exists')
          return data
