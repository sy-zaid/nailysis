from django.contrib.auth.models import User
from rest_framework import serializers


# ORM - Object Relational Mapping
# JSON - Javascript Object Notation (Standard format for communicating with web applications)
# Serializer - Converts Python Objects into JSON Data
# class CustomUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser 
#         fields = ['id', 'username', 'first_name', 'last_name', 'email', 'phone', 'password']
#         extra_kwargs = {
#             'password': {'write_only': True},  
#             'email': {'required': True},       
#         }

#     def create(self, validated_data):
#         user = CustomUser.objects.create_user(**validated_data) # Create the user securely (password is hashed)
#         return user




# Sample User Serializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data) # Passing as a dictionary
        return user

    