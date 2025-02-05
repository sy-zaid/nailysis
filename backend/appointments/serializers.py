from appointments.models import Appointment,DoctorAppointment,TechnicianAppointment
from rest_framework import serializers
from users.serializers import PatientSerializer,DoctorSerializer,LabTechnicianSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    class Meta:
        model = Appointment
        fields = '__all__'  # Ensure fields match frontend keys


class DoctorAppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    doctor = DoctorSerializer()
    class Meta:
        model = DoctorAppointment
        fields = "__all__"
        
class TechnicianAppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    technician = LabTechnicianSerializer()
    class Meta:
        model = TechnicianAppointment
        fields = "__all__"