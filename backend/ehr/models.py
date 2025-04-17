from django.db import models
from users.models import Patient

class EHR(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    # record_id = models.AutoField(primary_key=True)
    medical_conditions = models.JSONField(blank=True, null=True)
    current_medications = models.JSONField(blank=True, null=True)
    immunization_records = models.JSONField(blank=True, null=True)
    # nail_image_analysis = models.JSONField(blank=True, null=True)
    # test_results = models.JSONField(blank=True, null=True)
    diagnoses = models.JSONField(blank=True, null=True)
    recommended_lab_test = models.JSONField(blank=True,null=True,default=list)
    # Appointment and Visit Details
    visit_date = models.DateField(null=True, blank=True)  # Date of the visit
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
    
    added_to_medical_history = models.BooleanField(default=False)
    
    def create_record(self):
        """
        Saves a new EHR record for the patient.
        """
        self.save()

    def update_record(self, data):
        """
        Updates the EHR record with provided data.
        
        Args:
            data (dict): Dictionary containing field names and their new values.
        """
        for key, value in data.items():
            setattr(self, key, value)
        self.save()

    def share_record(self):
        """
        Logic to share the record (e.g., with another provider or institution).
        """
        pass

    def generate_report(self):
        """
        Generates a medical report based on the patient's record.
        """
        pass

    def add_test_results(self, test_data):
        """
        Adds a new test result entry to the test_results field.
        
        Args:
            test_data (dict): Dictionary containing test result details.
        """
        self.test_results.append(test_data)
        self.save()

    def add_diagnosis(self, diagnosis_data):
        """
        Adds a new diagnosis entry to the diagnoses field.
        
        Args:
            diagnosis_data (dict): Dictionary containing diagnosis details.
        """
        self.diagnoses.append(diagnosis_data)
        self.save()

    def add_medication(self, medication_data):
        """
        Adds a new medication entry to the current_medications field.
        
        Args:
            medication_data (dict): Dictionary containing medication details.
        """
        self.current_medications.append(medication_data)
        self.save()

    def view_patient_history(self):
        """
        Retrieves all EHR records for the patient.
        
        Returns:
            QuerySet: A queryset containing all records related to the patient.
        """
        return EHR.objects.filter(patient=self.patient)

    def delete_record(self):
        """
        Deletes the current EHR record from the database.
        """
        self.delete()

    def __str__(self):
        """
        Returns a string representation of the EHR record.
        """
        return f"EHR Record for {self.patient.first_name} {self.patient.last_name}"
    
    def add_to_medical_history(self):
        """
        Adds relevant details from this EHR record to Medical History.
        Prevents duplicate entries.
        """
        history, created = MedicalHistory.objects.get_or_create(patient=self.patient)

        # Prevent duplicate chronic conditions, immunizations, etc.
        if self.diagnoses:
            if not history.chronic_conditions:
                history.chronic_conditions = []
            for condition in self.diagnoses:
                if condition not in history.chronic_conditions:
                    history.chronic_conditions.append(condition)

        if self.immunization_records:
            if not history.immunization_history:
                history.immunization_history = []
            for immunization in self.immunization_records:
                if immunization not in history.immunization_history:
                    history.immunization_history.append(immunization)

        # Add family history if it exists in the EHR
        if self.family_history:
            # Only update if the MedicalHistory doesn't have family history yet
            # or if we want to append the new information
            if not history.family_history:
                history.family_history = self.family_history
            else:
                # Optional: Append new family history to existing one
                history.family_history += f"\n\n{self.family_history}"

        history.last_updated = self.last_updated
        history.save()
        
        # Save the EHR record after updating the field
        self.added_to_medical_history = True
        self.save()


class MedicalHistory(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    family_history = models.TextField(null=True, blank=True)
    chronic_conditions = models.JSONField(null=True, blank=True)
    surgeries = models.JSONField(null=True, blank=True)
    immunization_history = models.JSONField(null=True, blank=True)  # Added
    injuries = models.JSONField(null=True, blank=True)
    allergies = models.JSONField(null=True, blank=True)  # Added

    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Medical History of {self.patient.first_name} {self.patient.last_name}"

