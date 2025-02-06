from users.models import Patient,Doctor,LabTechnician
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from api.serializers import CustomUserSerializer

class PatientSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = Patient
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = Doctor
        fields = "__all__"
        
class LabTechnicianSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = LabTechnician
        fields = "__all__"