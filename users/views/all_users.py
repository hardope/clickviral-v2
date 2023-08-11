from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import status
from ..serializers import UserSerializer
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

# Create your views here.
class AllUsers(APIView):
     @swagger_auto_schema(
          operation_summary='Get all users',
          operation_description='Get all users',
          responses={200: UserSerializer(many=True)}
     )
     def get(self, request):
          users = User.objects.all()
          serializer = UserSerializer(users, many=True)
          return Response(serializer.data, status=status.HTTP_200_OK)
