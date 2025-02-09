from rest_framework.routers import DefaultRouter
from users.views import DoctorAPIView,PatientAPIView

router = DefaultRouter()
router.register(r'doctors', DoctorAPIView, basename='doctor')
router.register(r'patients', PatientAPIView, basename='patients')
# router.register(r'specializations', SpecializationViewSet, basename='specialization')

urlpatterns = router.urls