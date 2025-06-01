from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NailAnalysisViewSet
from django.urls import path, re_path
from django.views.generic import RedirectView
from django.http import HttpResponse
from django.conf import settings
import requests


# In your urls.py
from django.urls import path, re_path
from django.http import HttpResponse
import requests
from django.conf import settings

def fastapi_proxy(request):
    """
    Proxy requests to FastAPI service
    """
    fastapi_url = f"{settings.FASTAPI_SERVICE_URL}/predict"
    
    try:
        if request.method == 'POST':
            # Handle file upload
            file = request.FILES.get('file')
            if not file:
                return HttpResponse('No file provided', status=400)
                
            files = {'file': (file.name, file, file.content_type)}
            response = requests.post(fastapi_url, files=files)
        else:
            return HttpResponse('Method not allowed', status=405)
            
        return HttpResponse(
            response.content,
            status=response.status_code,
            content_type=response.headers.get('content-type')
        )
    except Exception as e:
        return HttpResponse(str(e), status=500)



# Initialize DefaultRouter instance for appointment API endpoints
router = DefaultRouter()
router.register(r'nails', NailAnalysisViewSet, basename='nails')

# Define appointment-specific URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Automatically includes all routes for the viewsets
]

# urlpatterns += [
#     # ... your other URLs ...
#     re_path(r'^predict/?$', fastapi_proxy, name='fastapi-proxy'),
# ]