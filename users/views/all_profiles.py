from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import status
from ..serializers import UserSerializer, ProfileSerializer
from rest_framework.response import Response
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from ..models import Profile

# Create your views here.
class AllProfiles(APIView):
     @swagger_auto_schema(
          operation_summary='Get all profiles',
          operation_description='Get all profiles',
          responses={200: openapi.Response(description='OK',)}
     )

     def get(self, request):
          profiles = Profile.objects.all()
          serializer = ProfileSerializer(profiles, many=True)
          return Response(serializer.data, status=status.HTTP_200_OK)