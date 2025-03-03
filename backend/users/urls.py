from rest_framework.routers import DefaultRouter
from users.views import DoctorAPIView, PatientAPIView, UserSerializerView, LabTechnicianAPIView

# Initialize the DRF default router
router = DefaultRouter()
router.register(r'doctors', DoctorAPIView, basename='doctor')
router.register(r'patients', PatientAPIView, basename='patients')
router.register(r'current_users', UserSerializerView, basename='current_users')
router.register(r'lab_technicians', LabTechnicianAPIView, basename='lab_technician')
# router.register(r'specializations', SpecializationViewSet, basename='specialization')

urlpatterns = router.urls