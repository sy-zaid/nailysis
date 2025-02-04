from appointments.models import Appointment
from rest_framework import serializers
from users.serializers import PatientSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    class Meta:
        model = Appointment
        fields = '__all__'  # Ensure fields match frontend keys
