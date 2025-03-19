from rest_framework import serializers
from .models import LabTestType,LabTestOrder

class LabTestTypeSerailzer(serializers.ModelSerializer):
    class Meta:
        model = LabTestType
        fields = "__all__"