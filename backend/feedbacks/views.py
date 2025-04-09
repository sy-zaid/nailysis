from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.core.mail import send_mail
from .models import Feedback, FeedbackResponse
from .serializers import FeedbackSerializer, FeedbackResponseSerializer
from users.models import Patient, Doctor, ClinicAdmin, CustomUser, LabTechnician, LabAdmin
from datetime import datetime, timedelta

class FeedbackViewSet(viewsets.ModelViewSet):
    # queryset = Feedback.objects.all().order_by('-submitted_at')
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retrieve feedbacks based on user role:

        - Patients see only their own feedbacks.
        - Doctors see only their own feedbacks.
        - Lab Technicians see only their own feedbacks.
        - Clinic Admins see all clinic feedbacks.
        - Lab Admins see all lab feedbacks.

        Returns:
        - QuerySet of Feedback objects based on user role.
        """
        user = self.request.user  # Get the currently authenticated user

        if user.role == "patient":
            try:
                # Retrieve the logged-in patient's CustomUser instance
                patient = CustomUser.objects.get(user_id=user.user_id)
                # Return only feedbacks submitted by this patient
                return Feedback.objects.filter(user_id=patient)
            except Patient.DoesNotExist:
                return Feedback.objects.none()  # If no patient record exists, return an empty QuerySet

        elif user.role == "doctor":
            try:
                # Retrieve the logged-in doctor's CustomUser instance
                doctor = CustomUser.objects.get(user_id=user.user_id)
                # Return only feedbacks submitted by this doctor
                return Feedback.objects.filter(user_id=doctor)
            except Doctor.DoesNotExist:
                return Feedback.objects.none()

        elif user.role == "lab_technician":
            try:
                # Retrieve the logged-in lab technician's CustomUser instance
                lab_technician = CustomUser.objects.get(user_id=user.user_id)
                # Return only feedbacks submitted by this lab technician
                return Feedback.objects.filter(user_id=lab_technician)
            except LabTechnician.DoesNotExist:
                return Feedback.objects.none()

        elif user.role == "clinic_admin":
            # Return all clinic feedbacks (feedbacks related to clinic services)
            return Feedback.objects.filter(is_clinic_feedback=True)

        elif user.role == "lab_admin":
            # Return all lab feedbacks (feedbacks related to lab services)
            return Feedback.objects.filter(is_clinic_feedback=False)

        # Default case: Return all feedbacks if no role-based restriction applies
        return Feedback.objects.all()

    def perform_create(self, serializer):
        """
        Automatically assigns the currently authenticated user as the submitter when creating feedback.

        - Ensures that feedback submissions are linked to the user who is making the request.

        Parameters:
        - serializer (FeedbackSerializer): The serializer used to save the feedback object.
        """

        serializer.save(user=self.request.user)  # Assign the logged-in user to the feedback before saving.

    @action(detail=False, methods=['get'], url_path='categories')
    def fetch_categories(self, request):
        """
        Retrieves the predefined list of feedback categories.

        - These categories help categorize user feedback into specific types like:
          - Doctor Service
          - Appointment Issue
          - Billing & Payments
          - Lab Test Accuracy
          - Facilities & Cleanliness
          - Technical Issue
          - Suggestions and Improvements
        
        Returns:
        - JSON Response containing the list of feedback categories.
        """

        categories = [choice[0] for choice in Feedback.CATEGORY_CHOICES]  # Extract category names from choices
        return Response({"categories": categories})  # Return the list as a JSON response

    
    @action(detail=False, methods=['post'], url_path='submit_feedback')
    def submit_feedback(self, request):
        """
        API to submit feedback.
        Only Patients, Doctors, and Lab Technicians can submit feedback.
        """
        auth_users = ['patient', 'doctor', 'lab_technician']
        user = request.user

        #  Check if user is allowed
        if user.role not in auth_users:
            return Response({"message": "You are not authorized to submit feedback"}, status=403)

        #  Extract data from request
        category = request.data.get('category')
        description = request.data.get('description')
        is_clinic_feedback = request.data.get('is_clinic_feedback')

        if not category or not description:
            return Response({"message": "Category and description are required."}, status=400)

        #  Save feedback
        feedback = Feedback.objects.create(
            user=request.user,
            category=category,
            description=description,
            is_clinic_feedback=is_clinic_feedback
        )

        return Response({"message": "Feedback submitted successfully", 
                         "feedback_id": feedback.id}, status=201)


    @action(detail=True, methods=['post'], url_path='mark_resolved')
    def mark_feedback_resolved(self, request, pk=None):
        """
        Marks a feedback entry as 'Resolved'.
        - Only Clinic Admins can mark clinic feedback as resolved.
        - Only Lab Admins can mark lab feedback as resolved.
        """
        feedback = self.get_object()
        user = request.user

        #  Clinic Admins can resolve only clinic feedback
        if user.role == "clinic_admin" and not feedback.is_clinic_feedback:
            return Response({"message": "You are not authorized to resolve lab feedback."}, status=status.HTTP_403_FORBIDDEN)

        #  Lab Admins can resolve only lab feedback
        elif user.role == "lab_admin" and feedback.is_clinic_feedback:
            return Response({"message": "You are not authorized to resolve clinic feedback."}, status=status.HTTP_403_FORBIDDEN)

        #  Mark feedback as resolved
        feedback.status = "Resolved"
        feedback.save()

        return Response({"message": "Feedback marked as resolved successfully"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], url_path='delete_feedback')
    def delete_feedback(self, request, pk=None):
        """
        Deletes a feedback entry.
        - Patients, Doctors, and Lab Technicians can delete only their own feedback.
        - Clinic Admins can delete clinic feedback.
        - Lab Admins can delete lab feedback.
        """
        feedback = self.get_object()
        user = request.user
    
        #  Patients, Doctors, and Lab Technicians can delete only their own feedback
        if user.role in ["patient", "doctor", "lab_technician"]:
            if feedback.user != user:
                return Response({"message": "You can only delete your own feedback."}, status=status.HTTP_403_FORBIDDEN)
    
        #  Clinic Admins can delete only clinic-related feedback
        elif user.role == "clinic_admin" and not feedback.is_clinic_feedback:
            return Response({"message": "You are not authorized to delete lab feedback."}, status=status.HTTP_403_FORBIDDEN)
    
        #  Lab Admins can delete only lab-related feedback
        elif user.role == "lab_admin" and feedback.is_clinic_feedback:
            return Response({"message": "You are not authorized to delete clinic feedback."}, status=status.HTTP_403_FORBIDDEN)
    
        feedback.delete()
        return Response({"message": "Feedback deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class FeedbackResponseViewSet(viewsets.ModelViewSet):
    queryset = FeedbackResponse.objects.all()
    serializer_class = FeedbackResponseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Retrieve feedback responses based on user role:

        - Patients, Doctors, and Lab Technicians see only responses to their feedbacks.
        - Clinic Admins see responses for clinic feedbacks.
        - Lab Admins see responses for lab feedbacks.
        """
        return FeedbackResponse.objects.filter(feedback__is_clinic_feedback=True)
        user = self.request.user  # Get the logged-in user

        if user.role in ["patient", "doctor", "lab_technician"]:
            return FeedbackResponse.objects.filter(feedback__user_id=user)

        elif user.role == "clinic_admin":
            return FeedbackResponse.objects.filter(feedback__is_clinic_feedback=True)

        elif user.role == "lab_admin":
            return FeedbackResponse.objects.filter(feedback__is_clinic_feedback=False)

        # Default case: If no specific role-based restriction applies
        return FeedbackResponse.objects.all()

    def perform_create(self, serializer):
        """
        Automatically assigns the currently authenticated admin as the responder when creating response.

        - Ensures that response submissions are linked to the admin who is making the request.

        Parameters:
        - serializer (FeedbackResponseSerializer): The serializer used to save the response object.
        """

        serializer.save(user=self.request.user)  # Assign the logged-in admin to the response before saving.

    @action(detail=True, methods=['post'], url_path='submit_response')
    def submit_response(self, request, pk=None):
        """
        API for admins to submit a response to feedback.
        Only Clinic Admins and Lab Admins can respond to feedback.
        """
        auth_users = ['clinic_admin', 'lab_admin']
        user = request.user

        #  Check if user is allowed
        if user.role not in auth_users:
            return Response({"message": "You are not authorized to respond to feedback"}, status=status.HTTP_403_FORBIDDEN)

        # Check if the feedback exists
        try:
            feedback = Feedback.objects.get(pk=pk)
        except Feedback.DoesNotExist:
            return Response({"message": "Feedback not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if a response already exists
        if hasattr(feedback, 'response'):
            return Response({"message": "A response already exists for this feedback."}, status=status.HTTP_400_BAD_REQUEST)

        # Extract data from request
        description = request.data.get('description')
        status_value = request.data.get('status', 'Pending')

        if not description:
            return Response({"message": "Response description is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the response
        feedback_response = FeedbackResponse.objects.create(
            feedback=feedback,
            admin=user,
            description=description
        )

        # Update feedback status if marked as resolved
        if status_value == "Resolved":
            feedback.status = "Resolved"
            feedback.save()

        return Response({"message": "Response submitted successfully", 
                         "response_id": feedback_response.id}, status=status.HTTP_201_CREATED)