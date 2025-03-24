from django.urls import path, include
from rest_framework.routers import DefaultRouter
from labs.views import LabTestTypeModelViewSet,LabTestOrderModelViewSet

# Initialize DefaultRouter instance for appointment API endpoints
router = DefaultRouter()
router.register(r'test_types', LabTestTypeModelViewSet, basename='test_types')
router.register(r'test_orders', LabTestOrderModelViewSet, basename='test_orders')


# Define appointment-specific URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Automatically includes all routes for the viewsets
]