from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import status
from ..serializers import UserSerializer
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404
from ..permissions import IsUserOrReadOnly

class OneUser(APIView):

     permission_classes = [IsUserOrReadOnly]

     def get_object(self, pk):
          obj = get_object_or_404(User, pk=pk)
          self.check_object_permissions(self.request, obj)
          return obj

     @swagger_auto_schema(
          operation_summary='Get a single user',
          operation_description='Get a single user',
          responses={
               200: UserSerializer,
               404: 'Not Found',
          }
     )
          
     def get(self, request, pk):
          user = self.get_object(pk)
          serializer = UserSerializer(user)
          return Response(serializer.data, status=status.HTTP_200_OK)

     @swagger_auto_schema(
          operation_summary='Update a single user',
          operation_description='Update a single user',
          request_body=UserSerializer,
          responses={
               200: UserSerializer,
               403: 'Forbidden',
               404: 'Not Found',
          }
     )
     def put(self, request, pk):
          user = self.get_object(pk)
          serializer = UserSerializer(user, data=request.data, context={'request': request}, partial=True)
          if serializer.is_valid():
               serializer.save()
               return Response(serializer.data, status=status.HTTP_200_OK)
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

     @swagger_auto_schema(    
          operation_summary='Delete a single user',
          operation_description='Delete a single user',
          responses={
               204: 'No Content',
               403: 'Forbidden',
               404: 'Not Found',
          }
     )
     def delete(self, request, pk):
          user = User.objects.get(pk=pk)
          user.delete()
          return Response(status=status.HTTP_204_NO_CONTENT)
