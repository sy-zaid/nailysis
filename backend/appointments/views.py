from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Appointment, DoctorAppointment, TechnicianAppointment, DoctorAppointmentFee,LabTechnicianAppointmentFee
from .serializers import AppointmentSerializer, DoctorAppointmentSerializer, TechnicianAppointmentSerializer, DoctorFeeSerializer
from users.models import Patient, Doctor
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
            return DoctorAppointment.objects.filter(doctor=user)
        
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

