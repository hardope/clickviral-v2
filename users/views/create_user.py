from rest_framework.views import APIView
from rest_framework import status
from ..serializers import UserSerializer
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


class CreateUser(APIView):
     @swagger_auto_schema(
          operation_summary='Create a new user',
          operation_description='Create a new user',
          request_body=UserSerializer,
          responses={201: 'CREATED', 400: 'Bad Request'}
     )
     def post(self, request):
          if request.user.is_authenticated:
               return Response(status=status.HTTP_400_BAD_REQUEST)
          serializer = UserSerializer(data=request.data, context={'request': request})
          if serializer.is_valid():
               serializer.save()
               return Response(serializer.data, status=status.HTTP_201_CREATED)
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
