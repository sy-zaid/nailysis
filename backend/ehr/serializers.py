from rest_framework import serializers
from appointments.models import Appointment, DoctorAppointment, TechnicianAppointment, DoctorAppointmentFee, LabTechnicianAppointmentFee,CancellationRequest
from users.models import Doctor,LabTechnician
from users.serializers import PatientSerializer, DoctorSerializer, LabTechnicianSerializer
from ehr.models import EHR

class EHRSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    
    class Meta:
        model = EHR
        fields = "__all__"
        
