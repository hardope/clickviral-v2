from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import status
from ..serializers import UserSerializer, ProfileSerializer
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from ..models import Profile
from django.shortcuts import get_object_or_404
from ..permissions import IsUserOrReadOnly

# Create your views here.

class OneProfile(APIView):

     permission_classes = [IsUserOrReadOnly]

     def get_object(self, pk):
          user = get_object_or_404(User, pk=pk)
          obj = get_object_or_404(Profile, user=user)
          self.check_object_permissions(self.request, obj)
          return obj

     @swagger_auto_schema(
          operation_summary='Get one profile',
          operation_description='Get one profile using id of user',
          responses={200: ProfileSerializer, 404: 'Not Found'}
     )

     def get(self, request, pk):

          profile = self.get_object(pk)
          serializer = ProfileSerializer(profile)
          return Response(serializer.data, status=status.HTTP_200_OK)

     @swagger_auto_schema(
          operation_summary='Update one profile',
          operation_description='Update one profile using id of user',
          request_body=ProfileSerializer,
          responses={200: 'OK',  400: 'Bad Request', 403: 'Forbidden', 404: 'Not Found'}
     )

     def put(self, request, pk):
          
          profile = self.get_object(pk)
          serializer = ProfileSerializer(profile, data=request.data, partial=True)
          if serializer.is_valid():
               serializer.save()
               return Response(serializer.data, status=status.HTTP_200_OK)
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

