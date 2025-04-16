from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets,permissions,status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

# WebSockets Imports
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

from appointments.models import (
    Appointment, DoctorAppointment, TechnicianAppointment, 
    DoctorAppointmentFee, CancellationRequest
)
from appointments.serializers import (
    AppointmentSerializer, DoctorAppointmentSerializer, 
    TechnicianAppointmentSerializer, DoctorFeeSerializer, DocCancelRequestSerializer
)

from .serializers import (EHRSerializer,MedicalHistorySerializer)

from users.models import Patient, Doctor, ClinicAdmin, CustomUser
from ehr.models import EHR,MedicalHistory


class EHRView(viewsets.ModelViewSet):
    queryset = EHR.objects.all()
    serializer_class = EHRSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        patient_id = self.request.query_params.get("patient")  # Get patient ID from request
        if patient_id:
            return EHR.objects.filter(patient_id=patient_id)  # Filter EHR records for that patient
        return EHR.objects.all()  # Return all records if no filter is applied

    
    @action(detail=False, methods=['post'], url_path="create_record")
    def create_record(self, request):
        user = self.request.user
        if user.role != "doctor":
            return Response(
                {"error": "Only doctors can create EHR records"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Convert JSON-encoded strings to lists (if necessary)
        def parse_json_field(field):
            return json.loads(field) if isinstance(field, str) else field
        
        medical_conditions = parse_json_field(request.data.get("medical_conditions", "[]"))
        current_medications = parse_json_field(request.data.get("current_medications", "[]"))
        immunization_records = parse_json_field(request.data.get("immunization_records", "[]"))
        diagnoses = parse_json_field(request.data.get("diagnoses", "[]"))
        comments = request.data.get("comments", "")
        family_history = request.data.get("family_history", "")
        category = request.data.get("category", "General")
        patient_id = request.data.get("patient_id")

        try:
            patient = Patient.objects.get(user_id=patient_id)
        except Patient.DoesNotExist:
            return Response({"error": "No Patient Found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            ehr_record = EHR.objects.create(
                patient=patient,
                visit_date="2025-02-21",  # Placeholder, update accordingly
                category=category,
                consulted_by=f"{user.first_name} {user.last_name}",
                medical_conditions=medical_conditions,
                current_medications=current_medications,
                immunization_records=immunization_records,
                diagnoses=diagnoses,
                comments=comments,
                family_history=family_history
            )
            ehr_record.save()

            # **Trigger WebSocket Update**
            self.send_websocket_create(ehr_record)

            return Response({
                "message": "Successfully added EHR",
                "id": ehr_record.id,  # Include the new record ID
                "ehr_data": EHRSerializer(ehr_record).data  # Send full record data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def send_websocket_create(self, ehr_record):
        channel_layer = get_channel_layer()
        print("Creating....")
        async_to_sync(channel_layer.group_send)(
            "ehr_updates",
            {
                "type": "ehr_update",
                "action": "create",
                "id": ehr_record.id,
                "message": "New EHR Record Created!",
                "ehr_data": EHRSerializer(ehr_record).data  # Send full EHR data
            }
        )

    def send_websocket_update(self, ehr_record):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "ehr_updates",
            {
                "type": "ehr_update",
                "action": "update",
                "id": ehr_record.id,
                "message": "EHR Record Updated!",
                "ehr_data": EHRSerializer(ehr_record).data  # Send updated EHR data
            }
        )

    def send_websocket_delete(self, id):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "ehr_updates",
            {
                "type": "ehr_update",
                "action": "delete",
                "id": id,
                "message": "EHR Record Deleted!",
            }
        )

        
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            self.send_websocket_update(instance)  # Send WebSocket Update Event
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        id = instance.id
        self.perform_destroy(instance)
        self.send_websocket_delete(id)  # Send WebSocket Delete Event
        return Response({"message": "EHR record deleted."}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True,methods=['post'],url_path="add_ehr_to_medical_history")
    def add_ehr_to_medical_history(self,request,pk = None):
        print("HELLLOOOOOOOOOOOOOOOO    ")
        user = self.request.user
        if user.role == "doctor":
            ehr_record,created = EHR.objects.get_or_create(pk=pk)
            ehr_record.add_to_medical_history()
            return Response({"message":"Successfully Added to Medical History"}, status=status.HTTP_201_CREATED)
        return Response({"error":"User not authorized to add ehr to medical history"})

    @action(detail=False, methods=["get"], url_path="recommended_tests")
    def get_recommended_tests(self, request):
        """
        Get all unique recommended lab tests for a patient.
        
        Parameters:
        - patient: Patient ID (required query parameter)
        
        Returns:
        - List of unique recommended test names
        - 403 if unauthorized
        - 400 if missing patient ID
        - 404 if patient not found
        """
        user = self.request.user
        if user.role not in ["lab_admin", "patient"]:
            return Response(
                {"error": "Unauthorized access to recommended tests"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        patient_id = request.query_params.get("patient")
        patient_email = request.query_params.get("email")
        
        if not patient_id and not patient_email:
            return Response(
                {"error": "Patient ID or Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            if patient_id:
                patient = Patient.objects.get(user_id=patient_id)
            else:
                user = CustomUser.objects.get(email=patient_email)
                patient = Patient.objects.get(user=user)
            ehr_records = EHR.objects.filter(
                patient=patient,
                recommended_lab_test__isnull=False
            ).exclude(recommended_lab_test=[])
            
            recommended_tests = []
            for record in ehr_records:
                if isinstance(record.recommended_lab_test, list):
                    recommended_tests.extend(
                        test for test in record.recommended_lab_test 
                        if test and isinstance(test, str)
                    )
            
            # Remove duplicates (using set while preserving order)
            seen = set()
            unique_tests = [x for x in recommended_tests if not (x in seen or seen.add(x))]
            
            return Response(unique_tests) 
            
        except Patient.DoesNotExist:
            return Response(
                {"error": "Patient not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Failed to retrieve recommended tests"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )       

class MedicalHistoryView(viewsets.ModelViewSet):
    queryset = MedicalHistory.objects.all()
    serializer_class = MedicalHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # user = self.request.user
        # if user.role != "doctor" or user.role != "clinic_admin"
        patient_id = self.request.query_params.get("patient")
        if patient_id:
            return MedicalHistory.objects.filter(patient_id = patient_id)
        else:
            return MedicalHistory.objects.all()
