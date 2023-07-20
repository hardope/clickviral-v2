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
               200: openapi.Response(
                    description='OK',
                    examples={
                         'application/json': {
                              'id': 1,
                              'username': 'john_doe',
                              'email': 'john@example.com',
                              'first_name': 'John',
                              'last_name': 'Doe',
                         }
                    }
               ),
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
          request_body=openapi.Schema(
               type=openapi.TYPE_OBJECT,
               properties={
                    'username': openapi.Schema(type=openapi.TYPE_STRING),
                    'password': openapi.Schema(type=openapi.TYPE_STRING, format='password'),
                    'email': openapi.Schema(type=openapi.TYPE_STRING, format='email'),
               },
               required=['username', 'password', 'email']
          ),
          responses={
               200: openapi.Response(
                    description='OK',
                    examples={
                         'application/json': {
                              'id': 1,
                              'username': 'john_doe',
                              'email': 'john@example.com',
                              'first_name': 'John',
                              'last_name': 'Doe',
                              'is_staff': False,
                              'is_active': True,
                         }
                    }
               ),
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
