from rest_framework import serializers
from appointments.models import Appointment, DoctorAppointment, TechnicianAppointment, DoctorAppointmentFee,CancellationRequest
from users.models import Doctor,LabTechnician
from users.serializers import PatientSerializer, DoctorSerializer, LabTechnicianSerializer
from ehr.models import EHR,MedicalHistory

class EHRSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    
    class Meta:
        model = EHR
        fields = "__all__"
        

class MedicalHistorySerializer(serializers.ModelSerializer):
    patient = PatientSerializer()

    class Meta:
        model = MedicalHistory
        fields = "__all__"