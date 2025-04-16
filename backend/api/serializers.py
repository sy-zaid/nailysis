from django.contrib.auth.models import User
from users.models import CustomUser,Patient
from appointments.models import Appointment
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.
    Handles user creation and representation in API responses.
    """
    date_of_birth = serializers.DateField(write_only=True, required=False)
    gender = serializers.CharField(write_only=True, required=False)
    address = serializers.CharField(write_only=True, required=False)
    emergency_contact = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ["user_id", "email", "password", "first_name", "last_name", "phone", "role",
                  "date_of_birth", "gender", "address", "emergency_contact"]  # Add patient fields
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        """
        Creates a new CustomUser instance with the given validated data.
        If role is patient, also creates a Patient instance.
        """
        # Extract patient-specific data
        patient_data = {
            'date_of_birth': validated_data.pop('date_of_birth', None),
            'gender': validated_data.pop('gender', None),
            'address': validated_data.pop('address', None),
            'emergency_contact': validated_data.pop('emergency_contact', None),
        }
        
        # Create the user
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'patient'),  # Default role is 'patient'
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', None),
        )
        
        # If user is a patient, create Patient instance
        if user.role == 'patient':
            Patient.objects.create(
                user=user,
                **{k: v for k, v in patient_data.items() if v is not None}
            )
        
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer that adds additional user data to the token.
    """
    @classmethod
    def get_token(cls, user):
        """
        Generates a JWT token for the given user, including custom claims.
        
        Args:
            user (CustomUser): The authenticated user instance.
        
        Returns:
            rest_framework_simplejwt.tokens.RefreshToken: The generated token with custom claims.
        """
        token = super().get_token(user)
        
        # Debugging: Print user role and ID (for development purposes only, remove in production)
        print("User role in token:", user.role)
        print("User ID in token:", user.user_id)
        
        # Add custom claims to the JWT token
        token['role'] = user.role  # Include user role in the token
        token['user_id'] = user.user_id  # Include user ID in the token
        
        return token
    
    