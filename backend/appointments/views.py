from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated

class AppointmentViewSet(viewsets.ModelViewSet):
    
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
