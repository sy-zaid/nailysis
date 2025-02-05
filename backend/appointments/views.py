from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets,permissions
from rest_framework.response import Response
from .models import Appointment,DoctorAppointment,TechnicianAppointment
from .serializers import AppointmentSerializer,DoctorAppointmentSerializer,TechnicianAppointmentSerializer
from users.models import Patient
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "clinic_admin":
            return Appointment.objects.all()

        if user.role == "doctor":
            return Appointment.objects.filter(doctor=user)

        if user.role == "patient":
            try:
                patient = Patient.objects.get(user=user)  # Ensure it's a Patient instance
                print("success")
            except Patient.DoesNotExist:
                return Appointment.objects.none()  # Return an empty queryset if no patient found
                print("failed")
            return Appointment.objects.filter(patient=patient)

        return Appointment.objects.none()  # If the role doesn't match, return an empty queryset

class DoctorAppointmentViewset(viewsets.ModelViewSet):
    queryset = DoctorAppointment.objects.all()
    serializer_class = DoctorAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(patient = self.request.user)
        
    @action(detail=False, methods=['post'])
    def book_appointment(self, request):
        doctor_id = request.data.get('doctor_id')
        appointment_date = request.data.get('appointment_date')
        appointment_time = request.data.get('appointment_time')
        appointment_type = request.data.get('appointment_type')
        specialization = request.data.get('specialization')
        consultation_fee = request.data.get('consultation_fee')

        doctor = get_object_or_404(Doctor, id=doctor_id)
        doctor_appointment = DoctorAppointment.objects.create(
            patient=request.user,
            doctor=doctor,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            appointment_type=appointment_type,
            specialization=specialization,
            consultation_fee=consultation_fee
        )
        return Response({
            "message": "Appointment booked successfully",
            "appointment_id": doctor_appointment.appointment_id
        })
    
class LabTechnicianAppointmentViewset(viewsets.ModelViewSet):
    queryset = TechnicianAppointment.objects.all()
    serializer_class = TechnicianAppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    
    
    
    