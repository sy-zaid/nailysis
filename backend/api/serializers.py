from django.contrib.auth.models import User
from users.models import CustomUser
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "password", "first_name", "last_name","phone","role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Create a new user with the validated data and hash the password
        custom_user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role = validated_data.get('role', 'patient'),  # Default role
            first_name = validated_data.get('first_name', ''),
            last_name = validated_data.get('last_name', ''),
            phone = validated_data.get('phone', None), 
        )
        return custom_user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['role'] = user.role  # Add the role to the token
        return token
    
