"""
views.py - Handles API endpoints for appointments, doctor fees, 
and cancellation requests in the Nailysis system.

This module contains Django REST Framework ViewSets for managing:
- Doctor fees
- Doctor appointments
- Lab technician appointments
- Appointment cancellations

Each ViewSet includes appropriate permission handling, custom actions,
and data validation.
"""

from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied

from .models import (
    Appointment, DoctorAppointment, TechnicianAppointment, 
    DoctorAppointmentFee, LabTechnicianAppointmentFee, CancellationRequest
)
from .serializers import (
    AppointmentSerializer, DoctorAppointmentSerializer, 
    TechnicianAppointmentSerializer, DoctorFeeSerializer, CancellationRequestSerializer
)
from users.models import Patient, Doctor, ClinicAdmin, CustomUser

class DoctorFeeViewset(viewsets.ModelViewSet):
    """
    API endpoint to manage doctor appointment fees.

    Provides:
    - List of all doctor appointment fees
    - Standard CRUD operations
    """
    queryset = DoctorAppointmentFee.objects.all()
    serializer_class = DoctorFeeSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'], url_path='get_fees')
    def get_fees(self, request):
        """
        Retrieve all appointment fees for display.
        
        Returns:
            JSON response containing the list of doctor fees.
        """
        fees = DoctorAppointmentFee.objects.all()
        serializer = self.get_serializer(fees, many=True)
        return Response(serializer.data)


class DoctorAppointmentViewset(viewsets.ModelViewSet):
    """
    API endpoint for managing doctor appointments.

    Provides:
    - Viewing appointments based on user role
    - Booking new doctor appointments
    - Cancelling and rescheduling appointments
    """
    queryset = DoctorAppointment.objects.all()
    serializer_class = DoctorAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retrieve appointments based on user role:
        - Patients see only their own appointments.
        - Doctors see only their own appointments.
        - Clinic admins see all appointments.
        """
        user = self.request.user

        if user.role == "patient":
            try:
                patient = Patient.objects.get(user=user)
                return DoctorAppointment.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return DoctorAppointment.objects.none()

        elif user.role == "clinic_admin":
            return DoctorAppointment.objects.all()

        elif user.role == "doctor":
            try:
                doctor = Doctor.objects.get(user=user)
                return DoctorAppointment.objects.filter(doctor=doctor)
            except Doctor.DoesNotExist:
                return DoctorAppointment.objects.none()

        return DoctorAppointment.objects.none()

    def perform_create(self, serializer):
        """
        Create a new doctor appointment.
        Assumes the logged-in user is a patient.
        """
        serializer.save(patient=self.request.user)

    def perform_destroy(self, instance):
        """
        Ensure only clinic admins can delete an appointment.
        """
        user = self.request.user
        if user.role == "clinic_admin":
            instance.delete()
        else:
            raise PermissionDenied("You are not authorized to delete this appointment.")

    @action(detail=False, methods=['post'], url_path='book_appointment')
    def book_appointment(self, request):
        """
        Book a new doctor appointment.

        Expected request data:
        - doctor_id
        - appointment_date
        - appointment_start_time
        - appointment_type
        - specialization
        - fee
        - patient details (if clinic admin books for a walk-in patient)
        """
        
        doctor_id = request.data.get('doctor_id')
        appointment_date = request.data.get('appointment_date')
        appointment_start_time = request.data.get('appointment_start_time')
        appointment_type = request.data.get('appointment_type')
        specialization = request.data.get('specialization')
        fee = request.data.get('fee')
        patient_email = request.data.get("patient_email")

        doctor = get_object_or_404(Doctor, user_id=doctor_id)
        user = self.request.user

        # Handling patient information
        if user.role == "clinic_admin":
            if not patient_email:
                patient = CustomUser.create_walkin_account(**request.data)
            else:
                patient = get_object_or_404(Patient, user__email=patient_email)
        elif user.role == "patient":
            patient = get_object_or_404(Patient, user=request.user)

        doctor_appointment = DoctorAppointment.objects.create(
            patient=patient,
            doctor=doctor,
            appointment_date=appointment_date,
            start_time=appointment_start_time,
            appointment_type=appointment_type,
            specialization=specialization,
            fee=fee
        )

        return Response({
            "message": "Appointment booked successfully",
            "appointment_id": doctor_appointment.appointment_id
        })

    @action(detail=True, methods=["post"], url_path="cancel_appointment")
    def cancel_appointment(self, request, pk=None):
        """
        Cancel a doctor appointment.

        Only patients and clinic admins are authorized to cancel appointments.
        """
        user = request.user
        if user.role not in ["patient", "clinic_admin"]:
            return Response({"error": "Unauthorized action."}, status=status.HTTP_403_FORBIDDEN)

        appointment = get_object_or_404(DoctorAppointment, pk=pk)
        appointment.cancel_appointment()
        return Response({"message": "Appointment cancelled successfully."}, status=status.HTTP_200_OK)
    
    @action(detail=True,methods=["post"],url_path='request_cancellation')
    def request_cancellation(self,request,pk=None):
        user = self.request.user
        if user.role != "doctor":
            return Response({"error":"Only Doctors can generate a cancellation request"},status=status.HTTP_403_FORBIDDEN)
        
        try:
            doctor = Doctor.objects.get(user=user)
            appointment = DoctorAppointment.objects.get(pk=pk,doctor=doctor)
        except(Doctor.DoesNotExist,DoctorAppointment.DoesNotExist):
            return Response({"error":"No Appointment Found"},status=status.HTTP_404_NOT_FOUND)
        
        reason = request.data.get('reason','').strip()
        if not reason:
            return Response({"error":"Cancellation reason is required"},status=status.HTTP_400_BAD_REQUEST)
        cancellation_request = CancellationRequest.objects.create(doctor=doctor,appointment=appointment,reason = reason,status="Pending")
        appointment.status = "Pending"
        appointment.save()
        return Response({"message":"Cancellation request sent successfully","request_id":cancellation_request.id},status=status.HTTP_201_CREATED)

    @action(detail=True,methods=['post'],url_path="save_and_complete")
    def save_and_complete(self,request,pk=None):
        user = self.request.user
        if user.role != "doctor":
            return Response({"error":"Only doctor can mark appointment as complete on this screen"})
        ehr_data = request.data
        print(ehr_data)
        try:
            appointment = DoctorAppointment.objects.get(pk=pk)
            appointment.complete_appointment(ehr_data=ehr_data)
            return Response({"message":"Successfully added ehr" })
        except(Doctor.DoesNotExist,DoctorAppointment.DoesNotExist):
            return Response({"error":"No Appointment Found"},status=status.HTTP_404_NOT_FOUND)
            
        
class LabTechnicianAppointmentViewset(viewsets.ModelViewSet):
    """
    API endpoint for managing lab technician appointments.
    """
    queryset = TechnicianAppointment.objects.all()
    serializer_class = TechnicianAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """
        Create a new lab technician appointment.
        """
        serializer.save(patient=self.request.user)

    @action(detail=False, methods=['post'], url_path='book_lab_appointment')
    def book_lab_appointment(self, request):
        """
        Book a new lab appointment.
        """

        technician_id = request.data.get('technician_id')
        appointment_date = request.data.get('appointment_date')
        appointment_start_time = request.data.get('appointment_start_time')
        service_type = request.data.get('service_type')
        lab_fee = request.data.get('lab_fee')

        technician = get_object_or_404(Technician, user__id=technician_id)

        technician_appointment = TechnicianAppointment.objects.create(
            patient=request.user,
            technician=technician,
            appointment_date=appointment_date,
            appointment_start_time=appointment_start_time,
            service_type=service_type,
            lab_fee=lab_fee
        )

        return Response({
            "message": "Lab appointment booked successfully",
            "appointment_id": technician_appointment.appointment_id
        })


class DocAppointCancellationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for handling doctor appointment cancellation requests.
    """
    queryset = CancellationRequest.objects.all()
    serializer_class = CancellationRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Allow only clinic admins to view all cancellation requests.
        """
        user = self.request.user
        if user.role == "clinic_admin":
            return CancellationRequest.objects.all()
        return CancellationRequest.objects.none()

    @action(detail=True, methods=['post'], url_path='review')
    def review_request(self, request, pk):
        """
        Allow clinic admins to approve or reject cancellation requests.
        """
        user = self.request.user
        if user.role != "clinic_admin":
            return Response({"error": "Only admins can review requests."}, status=status.HTTP_403_FORBIDDEN)

        cancellation_request = get_object_or_404(CancellationRequest, pk=pk, status="Pending")
        action = request.data.get("action", "").lower()

        if action not in ["approve", "reject"]:
            return Response({"error": "Invalid action. Use 'approve' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)

        cancellation_request.status = "Approved" if action == "approve" else "Rejected"
        cancellation_request.save()

        if action == "approve":
            cancellation_request.appointment.cancel_appointment()

        return Response({"message": f"Cancellation request {action}d successfully."})
