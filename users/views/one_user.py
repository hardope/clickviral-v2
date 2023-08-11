from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import status
from ..serializers import UserSerializer
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

class OneUser(APIView):
     @swagger_auto_schema(
          operation_summary='Get a single user',
          operation_description='Get a single user',
          responses={
               200: UserSerializer,
               404: 'Not Found',
          }
     )
          
     def get(self, request, pk):
          try:
               user = User.objects.get(pk=pk)
               serializer = UserSerializer(user)
          except User.DoesNotExist:
               return Response(status=status.HTTP_404_NOT_FOUND)
          return Response(serializer.data, status=status.HTTP_200_OK)

     @swagger_auto_schema(
          operation_summary='Update a single user',
          operation_description='Update a single user',
          request_body=UserSerializer,
          responses={
               200: UserSerializer,
               404: 'Not Found',
          }
     )
     def put(self, request, pk):
          user = User.objects.get(pk=pk)
          serializer = UserSerializer(user, data=request.data)
          if serializer.is_valid():
               serializer.save()
               return Response(serializer.data, status=status.HTTP_200_OK)
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

     @swagger_auto_schema(    
          operation_summary='Delete a single user',
          operation_description='Delete a single user',
          responses={
               204: 'No Content',
               404: 'Not Found',
          }
     )
     def delete(self, request, pk):
          try:
               user = User.objects.get(pk=pk)
               user.delete()
          except User.DoesNotExist:
               return Response(status=status.HTTP_404_NOT_FOUND)
          return Response(status=status.HTTP_204_NO_CONTENT)
