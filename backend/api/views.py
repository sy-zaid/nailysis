"""
views.py - Handles user authentication and registration for the Nailysis system.

This module provides:
- User registration endpoint
- Custom JWT authentication token view
"""

from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from users.models import CustomUser
from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer


class CreateUserView(generics.CreateAPIView):
    """
    API endpoint for user registration.

    This view allows new users to register by creating an account.

    - `POST /api/users/register/`
    - Publicly accessible (no authentication required)
    
    Attributes:
        - queryset: Retrieves all user objects (though not necessary for creation)
        - serializer_class: Defines the serializer for handling user registration
        - permission_classes: Allows unrestricted access (anyone can register)
        - authentication_classes: Set to an empty list to bypass authentication
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]  # Public access (no authentication required)
    authentication_classes = []  # No authentication required for registration


class CustomerTokenObtainViewSerializer(TokenObtainPairView):
    """
    Custom JWT authentication endpoint.

    This view extends Django Simple JWT's `TokenObtainPairView` to allow users 
    to obtain an access and refresh token upon successful authentication.

    - `POST /api/token/`
    - Requires valid user credentials (email and password)

    Attributes:
        - serializer_class: Uses a custom serializer for token generation
    """
    serializer_class = CustomTokenObtainPairSerializer
