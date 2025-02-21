from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets,permissions,status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from appointments.models import (
    Appointment, DoctorAppointment, TechnicianAppointment, 
    DoctorAppointmentFee, LabTechnicianAppointmentFee, CancellationRequest
)
from appointments.serializers import (
    AppointmentSerializer, DoctorAppointmentSerializer, 
    TechnicianAppointmentSerializer, DoctorFeeSerializer, CancellationRequestSerializer
)

from .serializers import (EHRSerializer)

from users.models import Patient, Doctor, ClinicAdmin, CustomUser
from ehr.models import EHR


class EHRView(viewsets.ModelViewSet):
    queryset = EHR.objects.all()
    serializer_class = EHRSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        patient_id = self.request.query_params.get("patient")  # Get patient ID from request
        if patient_id:
            return EHR.objects.filter(patient_id=patient_id)  # Filter EHR records for that patient
        return EHR.objects.all()  # Return all records if no filter is applied

    
    def create(self, request, *args, **kwargs):
        """Debugging method to check data being sent"""
        print(request.data)
        
        return super().create(request, *args, **kwargs)
    
    # def perform_update(self,request):
    #     user = self.request.user
    #     if user.role != "doctor":
    #         return Response({"error":"Not authorized to perform updates on EHR"})
        
    #     record = get_object_or_404(EHR,)
        
    def update(self, request, *args, **kwargs):
        print("PATCH Request Data:", request.data)
        return super().update(request, *args, **kwargs)
    
