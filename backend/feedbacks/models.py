from django.db import models
from users.models import CustomUser

class Feedback(models.Model):
    CATEGORY_CHOICES = [
        ('Doctor Service', 'Doctor Service'),
        ('Appointment Issue', 'Appointment Issue'),
        ('Billing & Payments', 'Billing & Payments'),
        ('Lab Test Accuracy', 'Lab Test Accuracy'),
        ('Facilities & Cleanliness', 'Facilities & Cleanliness'),
        ('Technical Issue', 'Technical Issue'),
        ('Nail Report Issue', 'Nail Report Issue'),
        ('Suggestions and Improvements', 'Suggestions and Improvements'),
    ]
    
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Resolved', 'Resolved'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Feedback submitter
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True, null=True)
    date_submitted = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    is_clinic_feedback = models.BooleanField()  # True = Clinic, False = Lab
    
    def __str__(self):
        return f"{self.user.email} - {self.category}"

class FeedbackResponse(models.Model):
    feedback = models.OneToOneField(Feedback, on_delete=models.CASCADE, related_name="response")
    admin = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Clinic Admin or Lab Admin
    description = models.TextField(blank=True, null=True)
    date_submitted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response to {self.feedback.user.email}"



## Make get query set function
## Create a file for api in frontend/src/api/feedbacksApi.js
## Reuse common functions from src/utils/utils.js (see examples from ehr)
## Add two buttons one for submit clinic feedback and submit lab feedback
## Add two more fields (response, responded_by) in the frontend table
## Response form for admins (textbox, mark resolved check button)
## Put user role conditions in frontend and backend views (what will be shown to what user)
## Write a function in script test populate for feedbacks creation = exec(open("test_populate.py").read())