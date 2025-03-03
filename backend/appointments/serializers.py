"""
Serializers for Appointment-related models.

This module defines serializers for handling appointment data, including:
- General Appointments
- Doctor-specific Appointments
- Lab Technician-specific Appointments

These serializers ensure proper data validation and transformation for API interactions.
"""

from rest_framework import serializers
from appointments.models import Appointment, DoctorAppointment, TechnicianAppointment, DoctorAppointmentFee, LabTechnicianAppointmentFee,CancellationRequest
from users.models import Doctor,LabTechnician
from users.serializers import PatientSerializer, DoctorSerializer, LabTechnicianSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer for general appointment data.

    Fields:
    - `patient`: Nested serializer to include patient details.
    - Includes all fields from the Appointment model.
    """
    patient = PatientSerializer()

    class Meta:
        model = Appointment
        fields = "__all__"  

class DoctorFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAppointmentFee
        fields = "__all__"
        
class DoctorAppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer for doctor-specific appointments.

    Fields:
    - `patient`: Nested PatientSerializer for patient details.
    - `doctor`: Nested DoctorSerializer for doctor details.
    - `appointment_id` is read-only and excluded from creation.

    Custom Behavior:
    - Overrides the `create` method to fetch patient and doctor objects 
      from the request context before saving.
    """
    patient = PatientSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = DoctorAppointment
        fields = "__all__"
        read_only_fields = ("appointment_id",)

    def create(self, validated_data):
        """
        Custom create method to associate the authenticated patient 
        with a selected doctor when creating a new appointment.

        - The `patient` is retrieved from the authenticated user.
        - The `doctor` is identified using the provided doctor ID.
        """
        request = self.context.get("request")
        patient = request.user.patient  # Assuming each user has a related patient profile
        doctor_id = request.data.get("doctor")
        doctor = Doctor.objects.get(user__id=doctor_id)

        return DoctorAppointment.objects.create(
            patient=patient, doctor=doctor, **validated_data
        )


class LabTechnicianFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTechnicianAppointmentFee
        fields = "__all__"

class TechnicianAppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer for lab technician-specific appointments.

    Fields:
    - `patient`: Nested PatientSerializer for patient details.
    - `technician`: Nested LabTechnicianSerializer for technician details.
    """
    patient = PatientSerializer()
    lab_technician = LabTechnicianSerializer()

    class Meta:
        model = TechnicianAppointment
        fields = "__all__"
        read_only_fields = ("appointment_id",)
        
    def create(self,validated_data):
        request = self.context.get("request")
        patient = request.user.patient
        lab_technician_id = self.request.data("lab_technician")
        
        lab_technician = TechnicianAppointment.objects.get(user__id = lab_technician_id)
        
        return TechnicianAppointment.objects.create(
            patient = patient, lab_technician=lab_technician, **validated_data
        )
        

class CancellationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CancellationRequest
        fields = "__all__" 