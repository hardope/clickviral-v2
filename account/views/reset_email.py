from rest_framework.views import APIView
from rest_framework import status
from ..models import Profile
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from utils import encode
from drf_yasg.utils import swagger_auto_schema
from comms import Email
from drf_yasg import openapi
from django.contrib.auth import authenticate

class ResetEmail(APIView):
    """
    Reset Email
    """

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Reset Email",
        request_body= openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING),
            }
        ),
        responses={
            201: "Email reset sent.",
            400: "Bad Request",
        },
    )
    def post(self, request):

        if not request.data['password']:
            return Response(
                {'error': 'Please provide a password.'}, status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=request.user.username, password=request.data['password'])

        if not user:
            return Response(
                {'error': 'Incorrect password.'}, status=status.HTTP_400_BAD_REQUEST
            )

        if not request.data['email']:
            return Response(
                {'error': 'Please provide an email address.'}, status=status.HTTP_400_BAD_REQUEST
            )
        
        if request.data['email'] == request.user.email:
            return Response(
                {'error': 'You are already using that email address.'}, status=status.HTTP_400_BAD_REQUEST
            )
        
        if Profile.objects.filter(email=request.data['email']).exists():
            return Response(
                {'error': 'Email is already in use.'}, status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        code = encode({'user_id': user.id, 'email': request.data['email']})
        domain = request.META['HTTP_HOST']
        mail = Email(username=request.user.username, to=request.data['email'], domain=domain)
        mail.send_email_reset(code)

        return Response(
            {'success': 'Email reset sent.'}, status=status.HTTP_201_CREATED
        )
