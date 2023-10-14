from rest_framework.views import APIView
from rest_framework import status
from ..serializers import ProfileSerializer
from ..models import Profile
from ..permissions import IsUserOrReadOnly
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404

class OneProfile(APIView):

    permission_classes = [IsAuthenticated, IsUserOrReadOnly]

    def get_object(self, pk):
        profile = get_object_or_404(Profile, pk=pk)
        self.check_object_permissions(self.request, profile)
        return profile

    @swagger_auto_schema(
        operation_description="Get One Profile",
        operation_summary="Get One Profile",
        responses={
            200: ProfileSerializer,
            403: "Forbidden",
            404: "Not Found",
        },
    )
    
    def get(self, request, pk):
        profile = self.get_object(pk)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Update Profile",
        operation_summary="Update Profile",
        request_body=ProfileSerializer,
        responses={
            200: ProfileSerializer,
            400: "Bad Request",
            403: "Forbidden",
            404: "Not Found",
        },
    )

    def put(self, request, pk):
        profile = self.get_object(pk)
        serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data, status=status.HTTP_200_OK
            )
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )
    
    @swagger_auto_schema(
        operation_description="Delete Profile",
        operation_summary="Delete Profile",
        responses={
            204: "No Content",
            403: "Forbidden",
            404: "Not Found",
        },
    )

    def delete(self, request, pk):
        profile = self.get_object(pk)
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)