"""
URL configuration for the backend project.

This module defines URL patterns for the Nailysis application's backend, including:

- **Admin Interface**: Django's built-in admin panel.
- **User Registration & Authentication**:
  - User registration endpoint.
  - API endpoints for obtaining and refreshing JWT tokens.
  - API authentication endpoints for login/logout using Django REST Framework.
- **Appointments API**:
  - General appointment management (CRUD operations).
  - Doctor-specific and lab technician-specific appointment handling.
"""

from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, CustomerTokenObtainViewSerializer
from rest_framework_simplejwt.views import TokenRefreshView
from appointments.urls import urlpatterns as appointment_urls
from appointments.urls import router
from users.urls import router as user_router
from users.urls import urlpatterns as users_urls

from ehr.urls import urlpatterns as ehr_urls
from ehr.urls import router as ehr_router

from feedbacks.urls import urlpatterns as feedbacks_urls
from feedbacks.urls import router as feedbacks_router


from labs.urls import urlpatterns as labs_urls
from labs.urls import router as labs_router
# Define URL patterns
urlpatterns = [
    path("admin/", admin.site.urls),  # Django admin panel for managing users, models, etc.

    # User authentication and registration
    path(
        "api/user/register/", CreateUserView.as_view(), name="register"
    ),  # Endpoint for user registration

    path(
        "api/token/", CustomerTokenObtainViewSerializer.as_view(), name="get_token"
    ),  # Endpoint for obtaining JWT access and refresh tokens

    path(
        "api/token/refresh/", TokenRefreshView.as_view(), name="refresh"
    ),  # Endpoint for refreshing JWT access tokens

    # API authentication using Django REST Framework's browsable API
    path("api-auth/", include("rest_framework.urls")),  # Provides login/logout views

    # Appointment API endpoints
    path("api/", include(router.urls)),  # Registers viewsets using Django REST Framework's router
    *appointment_urls,   # Additional appointment-related URLs (e.g., doctor-specific endpoints)

    path('api/', include(user_router.urls)),
    *users_urls,
    
    # EHR API endpoints
    path("api/", include(ehr_router.urls)),  # Registers viewsets using Django REST Framework's router
    *ehr_urls,   # Additional ehr-related URLs

    # feedbacks API endpoints
    path("api/", include(feedbacks_router.urls)),  # Registers viewsets using Django REST Framework's router
    *feedbacks_urls,   # Additional feedbacks-related URLs
    
    # LABS API endpoints
    path("api/", include(labs_router.urls)),  # Registers viewsets using Django REST Framework's router
    *labs_urls,   # Additional labs-related URLs
]
from django.conf import settings
from django.conf.urls.static import static
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)