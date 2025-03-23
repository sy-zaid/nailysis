from django.shortcuts import render

from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action


from .models import LabTestType,LabTestOrder,LabTestResult
from .serializers import LabTestTypeSerializer,LabTestOrderSerializer

class LabTestTypeModelViewSet(viewsets.ModelViewSet):
    queryset = LabTestType.objects.all()
    serializer_class = LabTestTypeSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return LabTestType.objects.all()

class LabTestOrderModelViewSet(viewsets.ModelViewSet):
    queryset = LabTestOrder.objects.all()
    serializer_class = LabTestOrderSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return LabTestOrder.objects.all()
    

    