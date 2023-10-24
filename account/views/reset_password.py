from rest_framework.views import APIView
from rest_framework import status
from ..models import Profile
from rest_framework.response import Response
from utils import encode
from drf_yasg.utils import swagger_auto_schema
from comms import Email
from drf_yasg import openapi
from django.contrib.auth.password_validation import validate_password
from django.core import validators
from django.contrib.auth import authenticate

class ResetPassword(APIView):

    """
    Reset Password
    """

    @swagger_auto_schema(
        operation_description="Reset Password",
        request_body= openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'previous_password': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING),
            }
        ),
        responses={
            201: "Password reset sent.",
            400: "Bad Request",
        },
    )
    def post(self, request):

        if request.user.is_authenticated:

            user = authenticate(username=request.user.username, password=request.data['previous_password'])

            if not user:
                return Response(
                    {'error': 'Incorrect password.'}, status=status.HTTP_400_BAD_REQUEST
                )
            
            pass_valid = validate_password(request.data['password'])
            if pass_valid:
                return Response(
                    {'error': pass_valid}, status=status.HTTP_400_BAD_REQUEST
                )

            user = request.user
            user.set_password(request.data['password'])
            user.save()
            return Response(
                {'success': 'Password reset.'}, status=status.HTTP_201_CREATED
            )

        if not request.data['password']:
            return Response(
                {'error': 'Please provide a password.'}, status=status.HTTP_400_BAD_REQUEST
            )
        
        if not request.data['email']:
            return Response(
                {'error': 'Please provide an email address.'}, status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            validate_password(request.data['password'])
        except Exception as e:
            return Response(
                {'error': e}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validators.validate_email(request.data['email'])
        except Exception as e:
            return Response(
                {'error': e}, status=status.HTTP_400_BAD_REQUEST
            )
        
        if not Profile.objects.filter(email=request.data['email']).exists():
            return Response(
                {'error': 'There is no account for this email address'}, status=status.HTTP_400_BAD_REQUEST
            )
        
        user = Profile.objects.get(email=request.data['email'])
        code = encode({'user_id': user.id, 'password': request.data['password']})
        domain = request.META['HTTP_HOST']
        mail = Email(user.username, to=user.email, domain=domain)
        mail.send_password_reset(code)

        return Response(
            {'success': 'Password reset sent.'}, status=status.HTTP_201_CREATED
        )