"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from django.shortcuts import redirect
from api.views import CustomerTokenObtainViewSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from appointments.urls import router  # Import the new API URLs
from appointments.urls import urlpatterns as appointment_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", CustomerTokenObtainViewSerializer.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"), # View for Refreshing the Token
    path("api-auth/", include("rest_framework.urls")), # Pre-built urls from the rest framework
    path("api/", include(router.urls)),
    *appointment_urls,   
    
]

from django.conf import settings
from django.conf.urls.static import static
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)