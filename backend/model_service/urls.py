from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NailAnalysisViewSet

# Initialize DefaultRouter instance for appointment API endpoints
router = DefaultRouter()
router.register(r'nails', NailAnalysisViewSet, basename='nails')

# Define appointment-specific URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Automatically includes all routes for the viewsets
]