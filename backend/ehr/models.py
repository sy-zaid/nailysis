from django.db import models
from users.models import Patient

class EHR(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    record_id = models.AutoField(primary_key=True)
    medical_conditions = models.JSONField(blank=True, null=True)
    current_medications = models.JSONField(blank=True, null=True)
    immunization_records = models.JSONField(blank=True, null=True)
    nail_image_analysis = models.JSONField(blank=True, null=True)
    test_results = models.JSONField(blank=True, null=True)
    diagnoses = models.JSONField(blank=True, null=True,default={"diagnoses": ["art", "necessary"]})
    
    # Appointment and Visit Details
    visit_date = models.DateField()  # Date of the visit
    category = models.CharField(max_length=50, choices=[
        ("Chronic", "Chronic"),
        ("Emergency", "Emergency"),
        ("Preventive", "Preventive"),
        ("General", "General"),
    ], default="General")  # Category of patient
    comments = models.TextField(blank=True, null=True)
    
    family_history = models.TextField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    consulted_by = models.CharField(max_length=255, blank=True)  # Name of the doctor or healthcare provider
    
    
    def create_record(self):
        # Logic to create a new record
        self.save()

    def update_record(self, data):
        # Logic to update the record with new data
        for key, value in data.items():
            setattr(self, key, value)
        self.save()

    def share_record(self):
        # Logic to share the record (e.g., with another provider)
        pass

    def generate_report(self):
        # Logic to generate a report based on the record
        pass

    def add_test_results(self, test_data):
        self.test_results.append(test_data)
        self.save()

    def add_diagnosis(self, diagnosis_data):
        self.diagnoses.append(diagnosis_data)
        self.save()

    def add_medication(self, medication_data):
        self.current_medications.append(medication_data)
        self.save()

    def view_patient_history(self):
        # Logic to view the entire history of a patient
        return EHR.objects.filter(patient=self.patient)

    def delete_record(self):
        # Logic to delete the record
        self.delete()

    def __str__(self):
        return f"EHR Record for {self.patient.first_name} {self.patient.last_name}"

