from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ehr.views import EHRView, MedicalHistoryView

# Initialize DefaultRouter instance for appointment API endpoints
router = DefaultRouter()
router.register(r'ehr_records', EHRView, basename='ehr_records')
router.register(r'medical_history',MedicalHistoryView, basename="medical_history")

# Define appointment-specific URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Automatically includes all routes for the viewsets
]