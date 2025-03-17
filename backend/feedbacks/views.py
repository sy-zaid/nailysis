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
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        - Retrieve feedbacks based on user role:
        - Patients see only their own feedbacks.
        - Doctors see only their own feedbacks.
        - Technician see only their own feedbacks.
        - Clinic Admins see all clinic feedbacks.
        - Lab Admins see all lab feedbacks.
        """
        return Feedback.objects.all()
        user = self.request.user

        if user.role == "patient":
            try:
                patient = Patient.objects.get(user=user)
                return Feedback.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return Feedback.objects.none()

        elif user.role == "doctor":
            try:
                doctor = Doctor.objects.get(user=user)
                return Feedback.objects.filter(doctor=doctor)
            except Doctor.DoesNotExist:
                return Feedback.objects.none()
            
        elif user.role == "lab_technician":
            try:
                lab_technician = LabTechnician.objects.get(user=user)
                return Feedback.objects.filter(lab_technician=lab_technician)
            except LabTechnician.DoesNotExist:
                return Feedback.objects.none()  

        elif user.role == "clinic_admin":
            return Feedback.objects.all(is_clinic_feedback=True)

        elif user.role == "lab_admin":
            return Feedback.objects.all(is_clinic_feedback=False)      

        return Feedback.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='submit_feedback')
    def submit_feedback(self, request):
        """
        Submit a new feedback.
        """
        auth_users = ['patient', 'doctor', 'lab_technician']
        # un_auth_users = ['clinic_admin', 'lab_admin']
        user = self.request.user


        # if user == pat, doc, lab_tech then will show submit feedback
        if user.role not in auth_users:
            return Response({"message": "You are not authorised to submit feedback",}) 

        print(request.data)
        category = request.data.get('category')
        date_submitted = request.data.get('date_submitted')
        description = request.data.get('description')
        status = request.data.get('status')
        is_clinic_feedback = request.data.get('is_clinic_feedback')

        # Handling user information
        if user.role == "patient":
            patient = get_object_or_404(Patient, user=request.user)
        elif user.role == "doctor":
            patient = get_object_or_404(Doctor, user=request.user)
        elif user.role == "lab_technician":
            patient = get_object_or_404(LabTechnician, user=request.user)    

        feedback = Feedback.objects.create(
            patient=patient,
            category=category,
            date_submitted=date_submitted,
            description=description,
            status=status,
            is_clinic_feedback=is_clinic_feedback   
        )

        return Response({"message": "Feedback submitted successfully",
                         "feedback_id": feedback.id})


    @action(detail=True, methods=['post'])
    def mark_resolved(self, request, pk=None):
        feedback = self.get_object()
        feedback.status = 'Resolved'
        feedback.save()
        return Response({"message": "Feedback marked as resolved"})

    @action(detail=True, methods=['delete'])
    def delete_feedback(self, request, pk=None):
        feedback = self.get_object()
        feedback.delete()
        return Response({"message": "Feedback deleted successfully"})

class FeedbackResponseViewSet(viewsets.ModelViewSet):
    queryset = FeedbackResponse.objects.all()
    serializer_class = FeedbackResponseSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        response = serializer.save(admin=self.request.user)
        self.send_response_notification(response)

    def send_response_notification(self, response):
        subject = "Response to Your Feedback"
        message = f"""
        Dear {response.feedback.user.get_full_name},

        Your feedback regarding "{response.feedback.category}" has been reviewed.

        Admin Response: {response.response_text}

        Thank you for your input!

        Regards,
        Clinic/Lab Admin
        """
        send_mail(subject, message, "admin@yourclinic.com", [response.feedback.user.email])

