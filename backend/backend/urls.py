from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, CustomerTokenObtainViewSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from appointments.views import AppointmentViewSet, DoctorAppointmentViewset, LabTechnicianAppointmentViewset
from django.conf import settings
from django.conf.urls.static import static

# Create router instance and register viewsets
router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointments')
router.register(r'doctor_appointments', DoctorAppointmentViewset, basename='doctor_appointments')
router.register(r'technician_appointments', LabTechnicianAppointmentViewset, basename='technician_appointments')

# Define urlpatterns list
urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", CustomerTokenObtainViewSerializer.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),  # View for Refreshing the Token
    path("api-auth/", include("rest_framework.urls")),  # Pre-built urls from the rest framework
    path("api/", include(router.urls)),  # Include appointment-related API URLs
    path('api/doctor_appointments/', include('appointments.urls')),  # Including doctor appointment URLs
]

# Static files handling for development
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
