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

        # ✅ Check if user is allowed
        if user.role not in auth_users:
            return Response({"message": "You are not authorized to submit feedback"}, status=403)

        # ✅ Extract data from request
        category = request.data.get('category')
        description = request.data.get('description')
        is_clinic_feedback = request.data.get('is_clinic_feedback')

        if not category or not description:
            return Response({"message": "Category and description are required."}, status=400)

        # ✅ Save feedback
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

        # ✅ Clinic Admins can resolve only clinic feedback
        if user.role == "clinic_admin" and not feedback.is_clinic_feedback:
            return Response({"message": "You are not authorized to resolve lab feedback."}, status=status.HTTP_403_FORBIDDEN)

        # ✅ Lab Admins can resolve only lab feedback
        elif user.role == "lab_admin" and feedback.is_clinic_feedback:
            return Response({"message": "You are not authorized to resolve clinic feedback."}, status=status.HTTP_403_FORBIDDEN)

        # ✅ Mark feedback as resolved
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
    
        # ✅ Patients, Doctors, and Lab Technicians can delete only their own feedback
        if user.role in ["patient", "doctor", "lab_technician"]:
            if feedback.user != user:
                return Response({"message": "You can only delete your own feedback."}, status=status.HTTP_403_FORBIDDEN)
    
        # ✅ Clinic Admins can delete only clinic-related feedback
        elif user.role == "clinic_admin" and not feedback.is_clinic_feedback:
            return Response({"message": "You are not authorized to delete lab feedback."}, status=status.HTTP_403_FORBIDDEN)
    
        # ✅ Lab Admins can delete only lab-related feedback
        elif user.role == "lab_admin" and feedback.is_clinic_feedback:
            return Response({"message": "You are not authorized to delete clinic feedback."}, status=status.HTTP_403_FORBIDDEN)
    
        feedback.delete()
        return Response({"message": "Feedback deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class FeedbackResponseViewSet(viewsets.ModelViewSet):
    queryset = FeedbackResponse.objects.all()
    serializer_class = FeedbackResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """
        Automatically assigns the currently authenticated admin as the responder when creating response.

        - Ensures that response submissions are linked to the admin who is making the request.

        Parameters:
        - serializer (FeedbackResponseSerializer): The serializer used to save the response object.
        """

        serializer.save(user=self.request.user)  # Assign the logged-in admin to the response before saving.

    @action(detail=True, methods=['post'], url_path='submit_response')
    def submit_feedback_response(self, request, pk=None):
        """
        Allows Clinic Admins and Lab Admins to respond to feedback and update its status.

        - **Clinic Admins can respond to clinic feedback only.**
        - **Lab Admins can respond to lab feedback only.**
        - **Response text can be empty.**
        - **Admins can update the status ('Pending' or 'Resolved').**
        """

        user = request.user  # Get the logged-in user
        feedback = self.get_object()  # Get the feedback object from the request

        # ✅ Check if the user is an admin
        if user.role not in ["clinic_admin", "lab_admin"]:
            return Response({"message": "You are not authorized to respond to feedback."}, status=status.HTTP_403_FORBIDDEN)

        # ✅ Clinic Admin can only respond to clinic feedback
        if user.role == "clinic_admin" and not feedback.is_clinic_feedback:
            return Response({"message": "You are not allowed to respond to lab feedback."}, status=status.HTTP_403_FORBIDDEN)

        # ✅ Lab Admin can only respond to lab feedback
        if user.role == "lab_admin" and feedback.is_clinic_feedback:
            return Response({"message": "You are not allowed to respond to clinic feedback."}, status=status.HTTP_403_FORBIDDEN)

        # ✅ Extract response data from request
        response_text = request.data.get('description', '').strip()  # Can be empty
        new_status = request.data.get('status', feedback.status)  # Default to existing status

        # ✅ Update or create Feedback Response
        feedback_response, created = FeedbackResponse.objects.update_or_create(
        feedback=feedback,
        defaults={
            "admin": user,
            "description": response_text
            }
        )

        # ✅ Update Feedback Status (Pending/Resolved)
        feedback.status = new_status
        feedback.save()

        return Response({
            "message": "Response submitted successfully",
            "feedback_id": feedback.id,
            "response_id": feedback_response.id,
            "status_updated": new_status
        }, status=status.HTTP_200_OK)


    