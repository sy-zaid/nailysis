from django.db import models
from users.models import Patient, Doctor, LabTechnician, ClinicAdmin

class Appointment(models.Model):
    """
    Represents a general appointment in the system.
    
    Attributes:
        appointment_id (int): Unique identifier for the appointment.
        patient (ForeignKey): Reference to the patient associated with the appointment.
        appointment_date (date): Date of the appointment.
        appointment_time (time): Time of the appointment.
        status (str): Current status of the appointment (Scheduled, Completed, Cancelled, Rescheduled).
        reminder_sent (bool): Indicates if a reminder has been sent.
        notes (str, optional): Additional notes related to the appointment.
    """
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
        """Schedules an appointment with the given date and time."""
        self.appointment_date = date
        self.appointment_time = time
        self.status = "Scheduled"
        self.save()

    def cancel_appointment(self):
        """Cancels the appointment."""
        self.status = "Cancelled"
        self.save()

    def reschedule_appointment(self, new_date, new_time,new_specialization,new_doctor,new_appointment_type):
        try:
            """Reschedules the appointment to a new date and time."""
            self.appointment_date = new_date
            self.appointment_time = new_time
            if isinstance(self, DoctorAppointment):  # Check if it's a DoctorAppointment
                print("YES ITS A DOCTOR APPOINTMENT INSTANCE")
                if new_specialization:
                    self.specialization = new_specialization
                if new_doctor:
                   # Fetch the Doctor instance using the ID
                    try:
                        doctor_instance = Doctor.objects.get(pk=new_doctor)
                        self.doctor = doctor_instance
                    except Doctor.DoesNotExist as e:
                        raise ValueError(f"Doctor with ID {new_doctor} does not exist") from e
                if new_appointment_type:
                    self.appointment_type = new_appointment_type
            self.status = "Rescheduled"
            self.save()

        except Exception as e:
            print(f"Error while rescheduling: {e}")

    def reschedule_lab_appointment(self, new_date, new_time,new_specialization,new_lab_technician,new_appointment_type):
        try:
            """Reschedules the appointment to a new date and time."""
            self.appointment_date = new_date
            self.appointment_time = new_time
            if isinstance(self, TechnicianAppointment):  # Check if it's a LabTechnicianAppointment
                print("YES ITS A LAB TECHNICIAN APPOINTMENT INSTANCE")
                if new_specialization:
                    self.specialization = new_specialization
                if new_lab_technician:
                   # Fetch the Lab Technician instance using the ID
                    try:
                        lab_technician_instance = LabTechnician.objects.get(pk=new_lab_technician)
                        self.lab_technician = lab_technician_instance
                    except Doctor.DoesNotExist as e:
                        raise ValueError(f"Lab Technician with ID {new_lab_technician} does not exist") from e
                if new_appointment_type:
                    self.appointment_type = new_appointment_type
            self.status = "Rescheduled"
            self.save()

        except Exception as e:
            print(f"Error while rescheduling: {e}")        

    def confirm_attendance(self):
        """Marks the appointment as completed."""
        self.status = "Completed"
        self.save()

    def view_appointment_details(self):
        """Returns a dictionary containing appointment details."""
        return {
            "Appointment ID": self.appointment_id,
            "Patient": self.patient,
            "Date": self.appointment_date,
            "Time": self.appointment_time,
            "Status": self.status,
            "Notes": self.notes,
        }

    def update_status(self, new_status):
        """Updates the appointment status if the new status is valid."""
        if new_status in dict(self.STATUS_CHOICES):
            self.status = new_status
            self.save()

    def __str__(self):
        return f"Appointment {self.appointment_id} - {self.patient} on {self.appointment_date} at {self.appointment_time}"

class DoctorAppointmentFee(models.Model):
    """
    Stores fees for different types of doctor appointments.
    
    Attributes:
        appointment_type (str): Type of appointment.
        fee (decimal): Fee amount for the appointment type.
    """
    APPOINTMENT_TYPES = [
        ("Consultation", "Consultation"),
        ("Follow-up", "Follow-up"),
        ("Routine Checkup", "Routine Checkup"),
        ("Emergency Visit", "Emergency Visit"),
        ("Prescription Refill", "Prescription Refill"),
    ]

    appointment_type = models.CharField(max_length=50, choices=APPOINTMENT_TYPES, unique=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2)

    @classmethod
    def get_fee(cls, appointment_type):
        """Retrieves the fee for a given appointment type."""
        try:
            return cls.objects.get(appointment_type=appointment_type).fee
        except cls.DoesNotExist:
            return None

    @classmethod
    def update_fee(cls, appointment_type, new_fee):
        """Updates or creates a fee for an appointment type."""
        fee_obj, created = cls.objects.update_or_create(
            appointment_type=appointment_type, defaults={"fee": new_fee}
        )
        return fee_obj

class DoctorAppointment(Appointment):
    """
    Represents an appointment with a doctor.
    
    Attributes:
        doctor (ForeignKey): Reference to the assigned doctor.
        appointment_type (str): Type of appointment.
        specialization (str): Doctor's specialization.
        follow_up (bool): Indicates if the appointment is a follow-up.
        fee (decimal, optional): Fee for the appointment.
    """
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="doctor_appointments")
    appointment_type = models.CharField(max_length=50)
    specialization = models.CharField(max_length=100) # REVISE THIS FIELD
    follow_up = models.BooleanField(default=False)
    fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):
        """Sets the fee dynamically based on the appointment type."""
        if not self.fee:
            self.fee = DoctorAppointmentFee.get_fee(self.appointment_type) or 0.00
        super().save(*args, **kwargs)

class TechnicianAppointment(Appointment):
    """
    Represents an appointment for a laboratory technician.
    
    Attributes:
        lab_technician (ForeignKey): Reference to the assigned technician.
        test_type (str): Type of lab test.
        test_status (str): Status of the test.
        results_available (bool): Indicates if results are available.
    """
    lab_technician = models.ForeignKey(LabTechnician, on_delete=models.CASCADE, related_name="technician_appointments") 
    lab_test_type = models.CharField(max_length=100)  # Keep only one declaration
    test_status = models.CharField(max_length=50, default="Pending", null=True, blank=True) # made null temporarily
    results_available = models.BooleanField(default=False, null=True, blank=True) # made null temporarily
    fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Ensure this field exists

    def collect_sample(self):
        """Updates test status when a sample is collected."""
        self.test_status = "Sample Collected"
        self.save()

    def upload_test_results(self, results):
        """Marks test results as uploaded."""
        self.test_status = "Results Uploaded"
        self.results_available = True
        self.save()

    def update_test_status(self, results):
        """Marks test results as updated."""
        self.test_status = "Results Updated"
        self.results_available = True
        self.save() 

    def __str__(self):
        return f"Lab Test {self.lab_test_id} - {self.patient} ({self.lab_test_type})"


class LabTechnicianAppointmentFee(models.Model):
    """
    Stores fees for different types of lab test appointments.
    
    Attributes:
        lab_test_type (str): Type of lab test.
        fee (decimal): Fee amount for the lab test type.
    """
    LAB_TEST_TYPES = [
    ("Complete Blood Count (CBC)", "Complete Blood Count (CBC)"),
    ("Basic Metabolic Panel (BMP)", "Basic Metabolic Panel (BMP)"),
    ("Hemoglobin A1c (HbA1c)", "Hemoglobin A1c (HbA1c)"),
    ("Testosterone Test", "Testosterone Test"),
    ("PCR Test", "PCR Test"),
    ("BRCA Gene Test", "BRCA Gene Test")
    ]


    lab_test_type = models.CharField(max_length=50, choices=LAB_TEST_TYPES, unique=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    @classmethod
    def get_fee(cls, lab_test_type):
        """Retrieves the fee for a given lab test type."""
        try:
            return cls.objects.get(lab_test_type=lab_test_type).fee
        except cls.DoesNotExist:
            return None

    @classmethod
    def update_fee(cls, lab_test_type, new_fee):
        """Updates or creates a fee for a lab test type."""
        fee_obj, created = cls.objects.update_or_create(
            lab_test_type=lab_test_type, defaults={"fee": new_fee}
        )
        return fee_obj

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class CancellationRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="cancellation_requests")
    appointment = models.ForeignKey(DoctorAppointment, on_delete=models.CASCADE, related_name="cancellation_requests")
    reviewed_by = models.ForeignKey(ClinicAdmin, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    requested_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['appointment'],
                name='unique_cancellation_request_per_appointment'
            )
        ]
    def __str__(self):
        return f"Request by {self.doctor} for {self.appointment} - {self.status}"