from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FeedbackViewSet, FeedbackResponseViewSet

router = DefaultRouter()
router.register(r'feedbacks', FeedbackViewSet, basename='feedbacks')
router.register(r'feedback_response', FeedbackResponseViewSet, basename='feedback_response')

urlpatterns = [
    path('', include(router.urls)),
]