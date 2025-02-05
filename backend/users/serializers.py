from users.models import Patient
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from api.serializers import CustomUserSerializer

class PatientSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = Patient
        fields = '__all__'

