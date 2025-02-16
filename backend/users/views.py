"""
views.py - Defines API views for managing users, doctors, and patients in the Nailysis system.

This module includes:
- DoctorAPIView: Retrieves doctor details and filters by specialization.
- PatientAPIView: Handles patient-specific data retrieval.
- UserSerializerView: Provides access to authenticated user data.
"""

from django.shortcuts import render
from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Doctor, Patient, LabTechnician, ClinicAdmin, CustomUser
from .serializers import (
    DoctorSerializer,
    PatientSerializer,
    LabTechnicianSerializer,
    CustomUserSerializer
)


class DoctorAPIView(viewsets.ModelViewSet):
    """
    API view for managing doctors.

    - Allows retrieving all doctors (`GET /api/doctors/`).
    - Can filter doctors based on specialization using query parameters.
    - If no specialization is provided, returns a list of distinct specializations.

    Attributes:
        - queryset: Retrieves all doctor objects.
        - serializer_class: Specifies the serializer for doctor data.
        - permission_classes: Requires authentication.
    """
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        """
        Handles listing doctors and filtering by specialization.

        - If `specialization` is provided in query parameters, filters doctors accordingly.
        - Otherwise, returns a list of distinct specializations available.

        Query Parameters:
            - specialization (str, optional): The specialization to filter doctors by.

        Returns:
            - List of doctors (if specialization is provided).
            - List of distinct specializations (if no specialization is provided).
        """
        specialization = request.query_params.get('specialization', None)
        if specialization:
            self.queryset = Doctor.objects.filter(specialization=specialization)
        else:
            # If no specialization is provided, return distinct specializations
            specializations = Doctor.objects.values_list('specialization', flat=True).distinct()
            return Response(specializations)
        return super().list(request, *args, **kwargs)


class PatientAPIView(viewsets.ModelViewSet):
    """
    API view for managing patients.

    - Retrieves only the authenticated user's patient profile.
    - Allows listing and retrieving patient details.

    Attributes:
        - serializer_class: Defines how patient data is serialized.
        - permission_classes: Requires authentication.
    """
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Returns the patient profile of the authenticated user.

        Ensures users can only access their own patient records.

        Returns:
            - Queryset filtered for the logged-in user.
        """
        return Patient.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        """
        Handles listing patient data for the authenticated user.

        Returns:
            - The patient's profile data.
        """
        return super().list(request, *args, **kwargs)


class UserSerializerView(viewsets.ModelViewSet):
    """
    API view for retrieving authenticated user data.

    - Allows users to fetch their own profile information.

    Attributes:
        - serializer_class: Uses CustomUserSerializer to handle user data.
        - permission_classes: Requires authentication.
    """
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Returns the authenticated user's data.

        Ensures users can only retrieve their own profile details.

        Returns:
            - Queryset containing only the logged-in user's data.
        """
        user = self.request.user
        return CustomUser.objects.filter(user_id=user.user_id)  # Fetch only the logged-in user's data
