from rest_framework.routers import DefaultRouter
from users.views import DoctorAPIView,PatientAPIView,UserSerializerView

router = DefaultRouter()
router.register(r'doctors', DoctorAPIView, basename='doctor')
router.register(r'current_users', UserSerializerView, basename='current_users')
# router.register(r'specializations', SpecializationViewSet, basename='specialization')

urlpatterns = router.urls