from django.db import models
from users.models import Patient
from datetime import timezone

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
        Processes EHR data into structured medical history
        Handles both JSON and string formatted data
        """
        try:
            # Process medical conditions
            if self.medical_conditions:
                conditions = self._parse_field(self.medical_conditions)
                for condition in conditions:
                    self._create_condition(condition)

            # Process current medications
            if self.current_medications:
                medications = self._parse_field(self.current_medications)
                for medication in medications:
                    self._create_medication(medication)

            # Process family history
            if self.family_history:
                self._update_family_history()
 
            # Process immunizations
            if self.immunization_records:
                immunizations = self._parse_field(self.immunization_records)
                for immunization in immunizations:
                    self._create_immunization(immunization)

            # Process diagnoses
            if self.diagnoses:
                diagnoses = self._parse_field(self.diagnoses)
                for diagnosis in diagnoses:
                    self._create_diagnosis(diagnosis)

            self.added_to_medical_history = True
            self.save()
            return True
        except Exception as e:
            logger.error(f"Failed to add to medical history: {str(e)}", exc_info=True)
            return False

    def _parse_field(self, field_data):
        """Helper to ensure consistent list format from string, list, or dict input"""
        if isinstance(field_data, str):
            return [item.strip() for item in field_data.split(',') if item.strip()]
        elif isinstance(field_data, list):
            return field_data
        elif isinstance(field_data, dict):
            return [field_data]  # For consistency if single dict is passed
        return []

    def _create_condition(self, condition_name):
        """Create a medical condition record with auto-description"""
        name = str(condition_name)
        description = f"Condition '{name}' recorded on {self.visit_date} during consultation by Dr. {self.consulted_by}."

        MedicalHistory.objects.get_or_create(
            patient=self.patient,
            episode_type="Condition",
            title=name,
            defaults={
                'description': description,
                'start_date': self.visit_date or timezone.now().date(),
                'is_ongoing': True,
                'added_from_ehr': self
            }
        )

    def _create_medication(self, medication_name):
        """Create a medication record with auto-description"""
        name = str(medication_name)
        description = f"Medication '{name}' prescribed on {self.visit_date} by Dr. {self.consulted_by}."

        MedicalHistory.objects.get_or_create(
            patient=self.patient,
            episode_type="Medication",
            title=name,
            defaults={
                'description': description,
                'start_date': self.visit_date or timezone.now().date(),
                'is_ongoing': True,
                'added_from_ehr': self
            }
        )

    def _update_family_history(self):
        """Update or append to family history record"""
        history, created = MedicalHistory.objects.get_or_create(
            patient=self.patient,
            episode_type="Family",
            title="Family History",
            defaults={
                'description': self.family_history,
                'start_date': self.visit_date or timezone.now().date(),
                'is_ongoing': False,
                'added_from_ehr': self
            }
        )
        if not created:
            history.description += f"\n\nUpdate on {self.visit_date}: {self.family_history}"
            history.save()

    def _create_immunization(self, immunization_name):
        """Create an immunization record with auto-description"""
        name = str(immunization_name)
        description = f"Immunization '{name}' recorded on {self.visit_date} by Dr. {self.consulted_by}."

        MedicalHistory.objects.get_or_create(
            patient=self.patient,
            episode_type="Immunization",
            title=name,
            defaults={
                'description': description,
                'start_date': self.visit_date or timezone.now().date(),
                'is_ongoing': False,
                'added_from_ehr': self
            }
        )

    def _create_diagnosis(self, diagnosis_name):
        """Create a diagnosis record with auto-description"""
        name = str(diagnosis_name)
        description = f"Diagnosis '{name}' made on {self.visit_date} by Dr. {self.consulted_by}."

        MedicalHistory.objects.get_or_create(
            patient=self.patient,
            episode_type="Diagnosis",
            title=name,
            defaults={
                'description': description,
                'start_date': self.visit_date or timezone.now().date(),
                'is_ongoing': True,
                'added_from_ehr': self
            }
        )


    def __str__(self):
        return f"EHR Record for {self.patient.first_name} {self.patient.last_name}"
    
class MedicalHistory(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    episode_type = models.CharField(max_length=50, choices=[
        ('Condition', 'Condition'),
        ('Surgery', 'Surgery'),
        ('Injury', 'Injury'),
        ('Allergy', 'Allergy'),
        ('Immunization', 'Immunization'),
        ('Other', 'Other'),
    ])
    title = models.CharField(max_length=255)  # e.g., "Type 2 Diabetes"
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_ongoing = models.BooleanField(default=True)
    added_from_ehr = models.ForeignKey(EHR, on_delete=models.SET_NULL, null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

