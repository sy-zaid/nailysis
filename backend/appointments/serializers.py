from django.contrib.auth.models import User
from users.models import CustomUser
from appointments.models import Appointment
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'  # Ensure fields match frontend keys
