from .models import Profile, Account, Preferences, Image
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

        mail = Email(username=user.username ,to=user.email, domain=domain)
        mail.send_sign_up(account.activation_key, user.id)
        user.save()

        return user
    
    def validate(self, attrs):
            
        if self.context['request'].method == 'POST':

            if self.context['request'].user.is_authenticated:
                raise serializers.ValidationError({'error': 'You are already logged in.'})

            if not (attrs.get('email')):
                raise serializers.ValidationError({'email': 'provide a valid email address'})
            if Profile.objects.filter(email=attrs['email']).exists():
                raise serializers.ValidationError({'email': 'Email is already in use.'})
    
            if Profile.objects.filter(username=attrs['username']).exists():
                raise serializers.ValidationError({'username': 'Username is already in use.'})
            
            pass_valid = validate_password(attrs['password'])
            if pass_valid:
                raise serializers.ValidationError({'password': pass_valid})
        
        if self.context['request'].method == 'PUT':
            if attrs.get('email', False):
                raise serializers.ValidationError({'email': 'Email cannot be changed via this endpoint.'})

            if attrs.get('username', False):
                if Profile.objects.filter(username=attrs['username']).exists():
                    raise serializers.ValidationError({'username': 'Username is already in use.'})
                
        return attrs

class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = '__all__'

class PreferencesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Preferences
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    
        class Meta:
            model = Image
            fields = '__all__'

        def create(self, validated_data):
            image = Image.objects.create(**validated_data)
            image.user = self.context['request'].user
            image.save()
            return image
