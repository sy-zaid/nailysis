from django.shortcuts import render
from rest_framework import generics,viewsets,permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Doctor,Patient,LabTechnician
from .serializers import DoctorSerializer,PatientSerializer,LabTechnicianSerializer

class DoctorAPIView(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        specialization = request.query_params.get('specialization', None)
        if specialization:
            self.queryset = Doctor.objects.filter(specialization=specialization)
        else:
            # If no specialization is provided, return distinct specializations
            specializations = Doctor.objects.values_list('specialization', flat=True).distinct()
            return Response(specializations)
        return super().list(request, *args, **kwargs)

class PatientAPIView(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        """
        Override to return the queryset for the logged-in user.
        """
        # Filter patients by the currently authenticated user
        return Patient.objects.filter(user=self.request.user)
    
    
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)



