from .models import Profile, Account, Preferences
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from comms import Email

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
            'date_joined',
        ]

        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = Profile.objects.create(**validated_data)
        user.is_active = False
        user.is_staff = False
        user.is_superuser = False

        account = Account.objects.create(user=user)
        preferences = Preferences.objects.create(user=user)

        domain = self.context['request'].META['HTTP_HOST']

        mail = Email(to=user.email, domain=domain)
        mail.send_sign_up(account.activation_key, user.id)
        user.save()

        return user
    
    def validate(self, attrs):

        if not (attrs.get('email')):
            raise serializers.ValidationError({'email': 'provide a valid email address'})
        if Profile.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({'email': 'Email is already in use.'})
        if Profile.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'Username is already in use.'})
        
        if self.context['request'].method == 'PUT':
            if attrs.get('email', False):
                raise serializers.ValidationError({'email': 'Email cannot be changed via this endpoint.'})


        return attrs

class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = '__all__'

class PreferencesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Preferences
        fields = '__all__'