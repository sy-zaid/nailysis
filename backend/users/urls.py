from rest_framework.routers import DefaultRouter
from users.views import DoctorAPIView, PatientAPIView, UserSerializerView, LabTechnicianAPIView

# Initialize the DRF default router
router = DefaultRouter()

# Register API endpoints with corresponding viewsets
router.register(r'doctors', DoctorAPIView, basename='doctor')  # Endpoint for managing doctors
router.register(r'current_users', UserSerializerView, basename='current_users')  # Endpoint for retrieving current user details
router.register(r'lab_technicians', LabTechnicianAPIView, basename='lab_technician')
# router.register(r'specializations', SpecializationViewSet, basename='specialization')  # Uncomment if needed

# Generate the URL patterns from the router
urlpatterns = router.urls