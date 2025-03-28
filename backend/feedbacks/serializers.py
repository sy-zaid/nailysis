from rest_framework import serializers
from .models import Feedback, FeedbackResponse
from users.serializers import CustomUserSerializer

class FeedbackSerializer(serializers.ModelSerializer):
    # user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    # email = serializers.EmailField(source='user.email', read_only=True)
    user = CustomUserSerializer(read_only=True)
    class Meta:
        model = Feedback
        fields = '__all__'

class FeedbackResponseSerializer(serializers.ModelSerializer):
    # feedback_details = FeedbackSerializer(source='feedback', read_only=True)
    
    class Meta:
        model = FeedbackResponse
        fields = '__all__'

        