from rest_framework import serializers
from .models import NailDiseasePrediction
from users.serializers import CustomUserSerializer,PatientSerializer

class NailDiseasePredictionSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    user = CustomUserSerializer(read_only=True)
    class Meta:
        model = NailDiseasePrediction
        fields = '__all__'