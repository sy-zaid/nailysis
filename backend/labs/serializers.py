from rest_framework import serializers
from .models import LabTestType,LabTestOrder

class LabTestTypeSerailzer(serializers.ModelSerializer):
    class Meta:
        model = LabTestType
        fields = "__all__"
        
class LabTestOrderSerializer(serializers.ModelSerializer):
    test_types = LabTestTypeSerailzer(many=True, read_only=True) 
    class Meta:
        model = LabTestOrder
        fields = "__all__"