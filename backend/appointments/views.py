from django.shortcuts import render
from rest_framework import viewsets, permissions,status
from rest_framework.response import Response
from .models import Appointment, DoctorAppointment, TechnicianAppointment, DoctorAppointmentFee,LabTechnicianAppointmentFee, CancellationRequest
from .serializers import AppointmentSerializer, DoctorAppointmentSerializer, TechnicianAppointmentSerializer, DoctorFeeSerializer,CancellationRequestSerializer
from users.models import Patient, Doctor,ClinicAdmin
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
import logging

# Main Appointment ViewSet
class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Admins can view all appointments
        if user.role == "clinic_admin":
            return Appointment.objects.all()

        # Doctors can only view their appointments
        if user.role == "doctor":
            return Appointment.objects.filter(doctor=user)

        # Patients can view their appointments
        if user.role == "patient":
            try:
                patient = Patient.objects.get(user=user)
            except Patient.DoesNotExist:
                return Appointment.objects.none()  # Return an empty queryset if no patient found
            return Appointment.objects.filter(patient=patient)

        return Appointment.objects.none()  # Return an empty queryset if the role doesn't match

# Doctor Fee ViewSet
class DoctorFeeViewset(viewsets.ModelViewSet):
    queryset = DoctorAppointmentFee.objects.all()
    serializer_class = DoctorFeeSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'], url_path='get_fees')
    def get_fees(self, request):
        """Retrieve all appointment fees for display."""
        fees = DoctorAppointmentFee.objects.all()
        serializer = self.get_serializer(fees, many=True)
        return Response(serializer.data)
    
    
# Doctor Appointment ViewSet
class DoctorAppointmentViewset(viewsets.ModelViewSet):
    queryset = DoctorAppointment.objects.all()
    serializer_class = DoctorAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    
    def get_queryset(self):
        user = self.request.user
        if user.role == "patient":
            try:
                patient = Patient.objects.get(user=user)
            except Patient.DoesNotExist:
                return DoctorAppointment.objects.none()  # Return an empty queryset if no patient found
            return DoctorAppointment.objects.filter(patient=patient)
        
        elif user.role == "clinic_admin":
            return DoctorAppointment.objects.all()

        # Doctors can only view their appointments
        elif user.role == "doctor":
            try:
                doctor = Doctor.objects.get(user=user)
            except Doctor.DoesNotExist:
                return DoctorAppointment.objects.none()  # Return an empty queryset if no patient found
            return DoctorAppointment.objects.filter(doctor=doctor)
        
        return DoctorAppointment.objects.none()  # Return an empty queryset if the role doesn't match
        
        
    # Create a doctor appointment
    def perform_create(self, serializer):
        # Assuming the patient is being retrieved via the logged-in user
        serializer.save(patient=self.request.user)

    @action(detail=False, methods=['post'], url_path='book_appointment')
    def book_appointment(self, request):
        logging.info("book_appointment action was triggered")

        # Get data from request
        doctor_id = request.data.get('doctor_id')
        appointment_date = request.data.get('appointment_date')
        appointment_time = request.data.get('appointment_time')
        appointment_type = request.data.get('appointment_type')
        specialization = request.data.get('specialization')
        fee = request.data.get('fee')
        
        print("DATA------------------------------------------------")
        print(doctor_id,appointment_date,appointment_time,appointment_type,specialization,fee)

        # Get doctor by id or return 404 if not found
        doctor = get_object_or_404(Doctor, user__id=doctor_id)

        patient = get_object_or_404(Patient, user=request.user)
        
        # Create the DoctorAppointment
        doctor_appointment = DoctorAppointment.objects.create(
            patient=patient,
            doctor=doctor,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
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
        """Handles appointment cancellations by patients and clinic admins"""
        user = request.user

        if user.role not in ["patient", "clinic_admin"]:
            return Response({"error":"User is not authorized to cancel appointments."})

        # Get appointment or return 404
        appointment = get_object_or_404(DoctorAppointment, pk=pk)

        try:
            appointment.cancel_appointment()  # Call model method
            return Response({"message": "Appointment cancelled successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
    @action(detail=True,methods=["put"],url_path="reschedule_appointment")
    def reschedule_appointment(self,request,pk):
        user = self.request.user
        if user.role not in ["patient","clinic_admin"]:
            return Response({"error":"User not authorized for rescheduling appointment"})
        
        appointment = get_object_or_404(DoctorAppointment,pk=pk)
        new_specialization = "specialization"
        new_doctor = request.data.get("doctor_id")
        new_appointment_type = request.data.get("appointment_type")
        new_date = request.data.get("appointment_date")
        new_time = request.data.get("appointment_time")
        print(new_doctor,new_specialization,new_appointment_type,new_date,new_time)
        try:
            appointment.reschedule_appointment(new_date=new_date,
                                               new_time=new_time,
                                               new_specialization=new_specialization,
                                               new_doctor=new_doctor,
                                               new_appointment_type=new_appointment_type)
            return Response({"message":"Appointment rescheduled successfully"})
        except Exception as e:
            return Response({"error": e},status=status.HTTP_400_BAD_REQUEST)    
        
    
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
        cancellation_request = CancellationRequest.objects.create(doctor=doctor,appointment=appointment,reason = reason)
        
        return Response({"message":"Cancellation request sent successfully","request_id":cancellation_request.id},status=status.HTTP_201_CREATED)    


# Lab Technician Appointment ViewSet
class LabTechnicianAppointmentViewset(viewsets.ModelViewSet):
    queryset = TechnicianAppointment.objects.all()
    serializer_class = TechnicianAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Create a lab technician appointment
    def perform_create(self, serializer):
        # Assuming the patient is being retrieved via the logged-in user
        serializer.save(patient=self.request.user)

    @action(detail=False, methods=['post'], url_path='book_lab_appointment')
    def book_lab_appointment(self, request):
        logging.info("book_lab_appointment action was triggered")

        # Get data from request
        technician_id = request.data.get('technician_id')
        appointment_date = request.data.get('appointment_date')
        appointment_time = request.data.get('appointment_time')
        service_type = request.data.get('service_type')  # for the lab services
        lab_fee = request.data.get('lab_fee')

        # Get technician by id or return 404 if not found
        technician = get_object_or_404(Technician, user__id=technician_id)

        # Create the TechnicianAppointment
        technician_appointment = TechnicianAppointment.objects.create(
            patient=request.user,
            technician=technician,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            service_type=service_type,
            lab_fee=lab_fee
        )

        return Response({
            "message": "Lab appointment booked successfully",
            "appointment_id": technician_appointment.appointment_id
        })


class DocAppointCancellationViewSet(viewsets.ModelViewSet):
    queryset = CancellationRequest.objects.all()
    serializer_class = CancellationRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == "clinic_admin":
            return CancellationRequest.objects.all()
        return CancellationRequest.objects.none()
    
    @action(detail=True, methods=['post'], url_path='review')
    def review_request(self,request,pk):
        user = self.request.user
        if user.role != "clinic_admin":
            print("Requests can only be approved by admins")
            return Response({"error":"Requests can only be approved by admins"},status=status.HTTP_403_FORBIDDEN)
        
        
        try:
            clinic_admin = ClinicAdmin.objects.get(user=user)  # Fetch existing instance
        except ClinicAdmin.DoesNotExist:
            print(Exception)
            print("You are not a clinic admin")
            return Response({"error": "You are not a clinic admin"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            cancellation_request = CancellationRequest.objects.get(pk=pk,status="Pending")
            
        except CancellationRequest.DoesNotExist:
            return Response({"error":"No pending cancellation requests"},status=status.HTTP_404_NOT_FOUND)
        
        action = request.data.get("action","").lower()
        if action not in ["approve","reject"]:
            return Response({"error":"Invalid action Use 'approve' or 'reject'."},status=status.HTTP_400_BAD_REQUEST)
        
        cancellation_request.status = "Approve" if action == "approve" else "Rejected"
        cancellation_request.reviewed_by = clinic_admin
        cancellation_request.save()
        
        if action == "approve":
            cancellation_request.appointment.cancel_appointment()
            
        return Response({"message":f"Cancellation request {action}d successfully."})
    
    