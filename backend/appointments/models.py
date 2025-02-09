from django.db import models
from users.models import Patient, Doctor, LabTechnician  


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("Scheduled", "Scheduled"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
        ("Rescheduled", "Rescheduled"),
    ]

    appointment_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Scheduled")
    reminder_sent = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)

    def schedule_appointment(self, date, time):
        self.appointment_date = date
        self.appointment_time = time
        self.status = "Scheduled"
        self.save()

    def cancel_appointment(self):
        self.status = "Cancelled"
        self.save()

    def reschedule_appointment(self, new_date, new_time):
        self.appointment_date = new_date
        self.appointment_time = new_time
        self.status = "Rescheduled"
        self.save()

    def send_notification(self):
        # Implement notification logic
        pass

    def confirm_attendance(self):
        self.status = "Completed"
        self.save()

    def view_appointment_details(self):
        return {
            "Appointment ID": self.appointment_id,
            "Patient": self.patient,
            "Date": self.appointment_date,
            "Time": self.appointment_time,
            "Status": self.status,
            "Notes": self.notes,
        }

    def update_status(self, new_status):
        if new_status in dict(self.STATUS_CHOICES):
            self.status = new_status
            self.save()

    def __str__(self):
        return f"Appointment {self.appointment_id} - {self.patient} on {self.appointment_date} at {self.appointment_time}"

class DoctorAppointmentFee(models.Model):
    APPOINTMENT_TYPES = [
    ("Consultation", "Consultation"),
    ("Follow-up", "Follow-up"),
    ("Routine Checkup", "Routine Checkup"),
    ("Emergency Visit", "Emergency Visit"),
    ("Prescription Refill", "Prescription Refill"),
]


    appointment_type = models.CharField(max_length=50, choices=APPOINTMENT_TYPES, unique=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.appointment_type} - {self.fee} PKR"

    @classmethod
    def get_fee(cls, appointment_type):
        """Retrieve the fee for a given appointment type"""
        try:
            return cls.objects.get(appointment_type=appointment_type).fee
        except cls.DoesNotExist:
            return None  # Handle case where fee is not set

    @classmethod
    def update_fee(cls, appointment_type, new_fee):
        """Update or create a fee for an appointment type"""
        fee_obj, created = cls.objects.update_or_create(
            appointment_type=appointment_type, defaults={"fee": new_fee}
        )
        return fee_obj
    
    
class DoctorAppointment(Appointment):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="doctor_appointments")
    appointment_type = models.CharField(max_length=50)
    specialization = models.CharField(max_length=100)
    follow_up = models.BooleanField(default=False)
    fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):
        """Set the fee dynamically based on the appointment type when saving"""
        if not self.fee:  # Only set the fee if it's not already assigned
            self.fee = DoctorAppointmentFee.get_fee(self.appointment_type) or 0.00
        super().save(*args, **kwargs)

    def view_ehr(self, patient):
        # Logic to retrieve and return the patient's EHR
        pass

    def generate_prescription(self):
        # Logic to generate a prescription
        pass

    def add_visit_notes(self, notes):
        self.notes = notes
        self.save()

    def schedule_follow_up(self, follow_up_date, follow_up_time):
        return DoctorAppointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            appointment_date=follow_up_date,
            appointment_time=follow_up_time,
            appointment_type=self.appointment_type,
            specialization=self.specialization,
            follow_up=True,
        )

    def add_notes(self, notes):
        self.notes = notes
        self.save()

class LabTechnicianAppointmentFee(models.Model):
    pass

class TechnicianAppointment(Appointment):
    lab_technician = models.ForeignKey(LabTechnician, on_delete=models.CASCADE, related_name="technician_appointments")
    lab_test_id = models.IntegerField()
    test_type = models.CharField(max_length=100)
    test_status = models.CharField(max_length=50, default="Pending")
    results_available = models.BooleanField(default=False)

    def collect_sample(self):
        # Logic for sample collection
        self.test_status = "Sample Collected"
        self.save()

    def upload_test_results(self, results):
        # Logic to upload test results
        self.test_status = "Results Uploaded"
        self.results_available = True
        self.save()

    def update_test_results(self, new_results):
        # Logic to update test results
        self.test_status = "Updated Results"
        self.results_available = True
        self.save()

    def view_test_status(self):
        return self.test_status

    def assign_technician(self, technician):
        self.lab_technician = technician
        self.save()

    def __str__(self):
        return f"Lab Test {self.lab_test_id} - {self.patient} ({self.test_type})"
