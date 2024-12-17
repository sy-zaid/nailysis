from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from users.models import CustomUser
from .serializers import CustomUserSerializer,CustomTokenObtainPairSerializer

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]  # Allow public access to this view

class CustomerTokenObtainViewSerializer(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    