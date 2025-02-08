from django.shortcuts import render
from rest_framework import generics,viewsets,permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Doctor,Patient,LabTechnician
from .serializers import DoctorSerializer,PatientSerializer,LabTechnicianSerializer

class DoctorAPIView(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        specialization = request.query_params.get('specialization', None)
        if specialization:
            self.queryset = Doctor.objects.filter(specialization=specialization)
        return super().list(request, *args, **kwargs)





