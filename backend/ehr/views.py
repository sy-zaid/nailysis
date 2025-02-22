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
        patient_id =request.data.get("patient_id")
        patient = Patient.objects.get(user_id = patient_id)
        user = self.request.user
        return super().create(request, *args, **kwargs)
    
    @action(detail=False, methods=['post'], url_path="create_record")
    def create_record(self, request):
        import json
        user = self.request.user
        if user.role != "doctor":
            return Response({"error": "Only doctors can mark an appointment as complete on this screen"}, status=status.HTTP_403_FORBIDDEN)

        # Convert JSON-encoded strings to lists if necessary
        medical_conditions = request.data.get("medical_conditions", "[]")
        current_medications = request.data.get("current_medications", "[]")
        immunization_records = request.data.get("immunization_records", "[]")
        diagnoses = request.data.get("diagnoses", "[]")
        
        # If any of these are strings, convert them to lists
        if isinstance(medical_conditions, str):
            medical_conditions = json.loads(medical_conditions)
        if isinstance(current_medications, str):
            current_medications = json.loads(current_medications)
        if isinstance(immunization_records, str):
            immunization_records = json.loads(immunization_records)
        if isinstance(diagnoses, str):
            diagnoses = json.loads(diagnoses)

        comments = request.data.get("comments", "")
        family_history = request.data.get("family_history", "")
        category = request.data.get("category", "General")
        patient_id = request.data.get("patient_id")
        try:
            patient = Patient.objects.get(user_id=patient_id)
        except (Patient.DoesNotExist):
            return Response({"error": "No Patient Found"}, status=status.HTTP_404_NOT_FOUND)
        
        ehr_data = [category,medical_conditions, current_medications, immunization_records, diagnoses, comments, family_history]
        print(ehr_data)
        try:
            # Create EHR for the patient
            ehr_record = EHR.objects.create(
                patient=patient,  # Assuming patient is available through the Appointment model
                visit_date="2025-02-21",  # Make sure this exists in Appointment model
                category=ehr_data[0],  # Access category as a dictionary key
                consulted_by=f"{user.first_name} {user.last_name}",
                
                # Initialize fields with default empty values or placeholders
                medical_conditions=ehr_data[1],  # Access as dictionary
                current_medications=ehr_data[2],  # Access as dictionary
                # immunization_records=ehr_data[3],  # Access as dictionary
                # nail_image_analysis=ehr_data.nail_image_analysis,  # Access as dictionary
                # test_results=ehr_data.test_results,  # Access as dictionary
                diagnoses=ehr_data[4],  # Access as dictionary
                comments=ehr_data[5],  # Access as dictionary
                family_history=ehr_data[6]  # Access as dictionary
            )
            ehr_record.save()
            return Response({"message": "Successfully added ehr"})
        except (Doctor.DoesNotExist): 
            return Response({"error": "No Appointment Found"}, status=status.HTTP_404_NOT_FOUND)
        
    def update(self, request, *args, **kwargs):
        print("PATCH Request Data:", request.data)
        return super().update(request, *args, **kwargs)
    
