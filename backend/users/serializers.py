from users.models import Patient, Doctor, LabTechnician, ClinicAdmin, CustomUser
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from api.serializers import CustomUserSerializer

class PatientSerializer(serializers.ModelSerializer):
    """
    Serializer for the Patient model.
    Includes related user details through CustomUserSerializer.
    """
    user = CustomUserSerializer()
    
    class Meta:
        model = Patient
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    """
    Serializer for the Doctor model.
    Includes related user details through CustomUserSerializer.
    """
    user = CustomUserSerializer()
    
    class Meta:
        model = Doctor
        fields = "__all__"

class ClinicAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for the ClinicAdmin model.
    """
    class Meta:
        model = ClinicAdmin
        fields = '__all__'
        
class LabTechnicianSerializer(serializers.ModelSerializer):
    """
    Serializer for the LabTechnician model.
    Includes related user details through CustomUserSerializer.
    """
    user = CustomUserSerializer()
    
    class Meta:
        model = LabTechnician
        fields = "__all__"
        
class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.
    Includes nested serializers for related user roles.
    """
    patient = PatientSerializer(read_only=True)
    clinic_admin = ClinicAdminSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    # lab_admin = LabAdminSerializer(read_only=True)
    lab_technician = LabTechnicianSerializer(read_only=True)

    class Meta:
        model = CustomUser
        exclude = ["password"]  # Exclude password for security reasons

        
        
        
       