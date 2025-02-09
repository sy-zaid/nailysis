from django.contrib.auth.models import User
from users.models import CustomUser
from appointments.models import Appointment
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "password", "first_name", "last_name","phone","role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'patient'),  # Default role
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', None),
        )

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        print("User role in token:", user.role)
        print("User ID in token:", user.id)
        
        # Add custom claims to the JWT token
        token['role'] = user.role  # Add the role to the token
        token['user_id'] = user.id  # Add the user ID to the token
        
        return token
    
