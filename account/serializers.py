from .models import Profile, Account, Preferences
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = [
            'id',
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'bio',
            'location',
            'birth_date',
            'is_active',
            'joined_at',
        ]

    def create(self, validated_data):
        user = Profile.objects.create(**validated_data)
        user.is_active = False
        user.is_staff = False
        user.is_superuser = False
        user.save()
        return user
    
    def validate(self, attrs):
        
        if Profile.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({'email': 'Email is already in use.'})
        if Profile.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'Username is already in use.'})
        validate_password(attrs['password'])
        return attrs

class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = '__all__'

class PreferencesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Preferences
        fields = '__all__'