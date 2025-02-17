from django.db import models

class EHR(models.Model):
    """
    Electronic Health Record (EHR) model that stores medical history and related data for a patient.
    """
    patient = models.ForeignKey('users.Patient', on_delete=models.CASCADE)
    record_id = models.AutoField(primary_key=True)
    current_allergies = models.JSONField(blank=True, null=True)
    current_medications = models.JSONField(blank=True, null=True)
    immunization_records = models.JSONField(blank=True, null=True)
    nail_image_analysis = models.JSONField(blank=True, null=True)
    test_results = models.JSONField(blank=True, null=True)
    diagnoses = models.JSONField(blank=True, null=True)
    visits = models.JSONField(blank=True, null=True)
    family_history = models.TextField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    comments = models.TextField(blank=True, null=True)

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

