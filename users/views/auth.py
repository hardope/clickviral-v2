from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import UserSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth import authenticate, login, logout

class Auth(APIView):

    @swagger_auto_schema(
        operation_summary='Logout user',
        operation_description='Logout User',
        responses={200: 'OK'}
    )
    def get(self, request):
        try:
            logout(request)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        operation_summary='Login user',
        operation_description='Login User',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING, format='password'),
            },
            required=['username', 'password']
        ),
        responses={200: UserSerializer, 400: 'BAD REQUEST'}
    )
    def post(self, request):

        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user is not None:
            login(request, user)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = UserSerializer(user)
        return Response(user.data, status=status.HTTP_200_OK)