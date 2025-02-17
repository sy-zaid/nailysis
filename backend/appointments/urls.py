"""
URL Configuration for Appointment-related Endpoints.

This module defines URL patterns for managing appointments in the Nailysis application.

Features:
- Registers ViewSets for handling CRUD operations on appointments.
- Separates appointment-related URLs from the main URL configuration for better maintainability.
- Uses Django REST Framework's `DefaultRouter` to simplify API routing.

ViewSets Included:
- `AppointmentViewSet`: Manages general appointments.
- `DoctorAppointmentViewset`: Handles doctor-specific appointments.
- `LabTechnicianAppointmentViewset`: Handles lab technician-specific appointments.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorAppointmentViewset, LabTechnicianAppointmentViewset, DoctorFeeViewset,DocAppointCancellationViewSet

# Initialize DefaultRouter instance for appointment API endpoints
router = DefaultRouter()
router.register(r'doctor_appointments', DoctorAppointmentViewset, basename='doctor_appointments')
router.register(r'technician_appointments', LabTechnicianAppointmentViewset, basename='technician_appointments')
router.register(r'cancellation_requests', DocAppointCancellationViewSet, basename='cancellation_requests')
router.register(r'doctor_fees', DoctorFeeViewset, basename='doctor_fees')

# Define appointment-specific URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Automatically includes all routes for the viewsets
]
