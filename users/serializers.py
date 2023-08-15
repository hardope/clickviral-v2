from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from .sendmail import send_activation_mail
from .models import UserProfile as User

class UserSerializer(ModelSerializer):
     class Meta:
          model = User
          fields = '__all__'
          extra_kwargs = {'password':{'write_only':True,'required':True}, 'email':{'required':True}}
     
     def create(self, validated_data):

          domain = self.context['request'].META['HTTP_HOST']
          
          user = User.objects.create_user(**validated_data)
          user.is_active = False
          user.save()
          send_activation_mail(user, domain)
          return user

     def validate(self, data):

          if self.context['request'].method == 'POST':
               if User.objects.filter(email=data['email']).exists():
                    raise serializers.ValidationError({'email':'Email already exists'})

          if data.get('is_superuser', False):
               raise serializers.ValidationError({'is_superuser':'You cannot create a superuser'})
          if data.get('is_staff', False):
               raise serializers.ValidationError({'is_staff':'You cannot create a staff'})
          if data.get('is_active', False):
               raise serializers.ValidationError({'is_active':'You cannot create an active user'})
          return data
