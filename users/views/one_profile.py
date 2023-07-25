from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import status
from ..serializers import UserSerializer, ProfileSerializer
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from ..models import Profile

# Create your views here.

class OneProfile(APIView):
     @swagger_auto_schema(
          operation_summary='Get one profile',
          operation_description='Get one profile using id of user',
          responses={200: openapi.Response(description='OK',)}
     )

     def get(self, request, pk):
          try:
               user = User.objects.get(pk=pk)
          except User.DoesNotExist:
               return Response(status=status.HTTP_404_NOT_FOUND)
          profile = Profile.objects.get(user=user)
          serializer = ProfileSerializer(profile)
          return Response(serializer.data, status=status.HTTP_200_OK)

     @swagger_auto_schema(
          operation_summary='Update one profile',
          operation_description='Update one profile using id of user',
          request_body=openapi.Schema(
               type=openapi.TYPE_OBJECT,
               properties={
                    'bio': openapi.Schema(type=openapi.TYPE_STRING),
                    'location': openapi.Schema(type=openapi.TYPE_STRING),
                    'birth_date': openapi.Schema(type=openapi.TYPE_STRING, format='date'),
                    'image': openapi.Schema(type=openapi.TYPE_FILE),
               },
          ),
          responses={200: 'OK', 400: 'Bad Request'}
     )

     def put(self, request, pk):
          try:
               user = User.objects.get(pk=pk)
          except User.DoesNotExist:
               return Response(status=status.HTTP_404_NOT_FOUND)
          profile = Profile.objects.get(user=user)
          serializer = ProfileSerializer(profile, data=request.data)
          if serializer.is_valid():
               serializer.save()
               return Response(serializer.data, status=status.HTTP_200_OK)
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

