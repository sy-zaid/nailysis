from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NailAnalysisViewSet
from django.urls import path, re_path
from django.views.generic import RedirectView
from django.http import HttpResponse
from django.conf import settings
import requests


def fastapi_proxy(request, path):
    # Forward the request to FastAPI service
    fastapi_url = f"{settings.FASTAPI_SERVICE_URL}/{path}"
    if request.method == 'POST':
        files = {'file': request.FILES['file']}
        response = requests.post(fastapi_url, files=files)
    else:
        response = requests.get(fastapi_url)
    
    return HttpResponse(
        response.content,
        status=response.status_code,
        content_type=response.headers.get('content-type')
    )


# Initialize DefaultRouter instance for appointment API endpoints
router = DefaultRouter()
router.register(r'nails', NailAnalysisViewSet, basename='nails')

# Define appointment-specific URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Automatically includes all routes for the viewsets
]

urlpatterns += [
    # ... your other URLs ...
    re_path(r'^predict/?$', fastapi_proxy, name='fastapi-proxy'),
]