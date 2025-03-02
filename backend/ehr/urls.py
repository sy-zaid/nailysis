from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ehr.views import EHRView

# Initialize DefaultRouter instance for appointment API endpoints
router = DefaultRouter()
router.register(r'ehr_records', EHRView, basename='ehr_records')


# Define appointment-specific URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Automatically includes all routes for the viewsets
]