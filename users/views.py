from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response

# Create your views here.
class AllUsers(APIView):
     def get(self, request):
          users = User.objects.all()
          serializer = UserSerializer(users, many=True)
          return Response(serializer.data)

class CreateUser(APIView):
     def post(self, request):
          serializer = UserSerializer(data=request.data)
          if serializer.is_valid():
               serializer.save()
               return Response(serializer.data)
          return Response(serializer.errors)