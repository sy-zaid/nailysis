from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from django.shortcuts import redirect
from api.views import CustomerTokenObtainViewSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import AppointmentViewSet,DoctorAppointmentViewset,LabTechnicianAppointmentViewset
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet)
router.register(r'doctor_appointments', DoctorAppointmentViewset)
router.register(r'technician_appointments', LabTechnicianAppointmentViewset)

urlpatterns = [
    path('', include(router.urls)),  # Automatically includes all routes for the viewsets
]