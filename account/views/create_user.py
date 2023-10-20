from rest_framework.views import APIView
from rest_framework import status
from ..serializers import ProfileSerializer, ImageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema

class CreateProfile(APIView):
    """
    Create Profile
    """

    @swagger_auto_schema(
        operation_description="Create Profile",
        request_body=ProfileSerializer,
        responses={
            201: ProfileSerializer,
            400: "Bad Request",
        },
    )
    def post(self, request):
        serializer = ProfileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data, status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )
    
class CreateImage(APIView):
    """
    Create Image
    """

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Create Image",
        request_body=ImageSerializer,
        responses={
            201: ImageSerializer,
            400: "Bad Request",
        },
    )
    def post(self, request):
        serializer = ImageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data, status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )