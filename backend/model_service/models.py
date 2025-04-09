from django.db import models
from users.models import Patient

class NailDiseasePrediction(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    predicted_class = models.CharField(max_length=255)
    confidence = models.FloatField()
    all_predictions = models.JSONField()  # Can be list of predictions for all images
    symptoms = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Completed')  # Pending, Completed, Error

class NailImage(models.Model):
    prediction = models.ForeignKey(NailDiseasePrediction, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='nail_scans/')
    image_index = models.PositiveIntegerField(null=True, blank=True)