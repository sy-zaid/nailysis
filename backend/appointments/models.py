from django.db import models
from users.models import Patient, Doctor, LabTechnician, ClinicAdmin
from ehr.models import EHR
from django.utils.timezone import now
from datetime import datetime

class TimeSlot(models.Model):
    """
    Represents available time slots for appointments.
    These are generated in advance based on doctor availability.
    """
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="time_slots",null=True,blank=True)
    lab_technician = models.ForeignKey(LabTechnician, on_delete=models.CASCADE, related_name="time_slots",null=True,blank=True)
    slot_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.doctor} | {self.slot_date} | {self.start_time} - {self.end_time}"


class Appointment(models.Model):
    """
    Represents a general appointment in the system.
    
    Attributes:
        appointment_id (int): Unique identifier for the appointment.
        patient (ForeignKey): Reference to the patient associated with the appointment.
        appointment_date (date): Date of the appointment.
        start_time (time): Start Time of the appointment.
        end_time (time): End Time of the appointment.
        status (str): Current status of the appointment (Scheduled, Completed, Cancelled, Rescheduled).
        reminder_sent (bool): Indicates if a reminder has been sent.
        notes (str, optional): Additional notes related to the appointment.
    """
    STATUS_CHOICES = [
        ("Scheduled", "Scheduled"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
        ("Rescheduled", "Rescheduled"),
        ("No-Show", "No-Show"),
    ]

    appointment_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Scheduled")
    reminder_sent = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    
    # THESE ARE FOR SAVING APPOINTMENT DETAILS AFTER COMPLETION/DELETING TIMESLOT RECORD.
    appointment_date = models.DateField(null=True,blank=True)
    checkin_time = models.TimeField(null=True,blank=True)
    checkout_time = models.TimeField(null=True,blank=True)
    time_slot = models.OneToOneField(TimeSlot, on_delete=models.SET_NULL, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if self.time_slot:  # Ensure time_slot is not None
            self.appointment_date = self.time_slot.slot_date
            self.checkin_time = self.time_slot.start_time

            # If the appointment is completed, set checkout time
            if self.status == "Completed":
                self.checkout_time = self.time_slot.end_time

        super().save(*args, **kwargs)  # Ensure the object is actually saved
        
    
    def mark_no_show(self):
        """Mark appointment as No-show if patient doesn’t arrive"""
        self.status = "No-Show"
        self.save()
        
    def mark_completed(self):
        """Mark appointment as Completed when the consultation is done."""
        if self.status != "Completed":
            self.status = "Completed"

            if self.time_slot:  # Check if time slot exists before using it
                self.appointment_date = self.time_slot.slot_date
                self.checkin_time = self.time_slot.start_time
                self.checkout_time = now()
                
                # Delete the associated time slot
                self.time_slot.delete()
                self.time_slot = None  # Remove reference to prevent accessing a deleted object
            
            self.save()
            return True
        return False
        
    def cancel_appointment(self):
        """Cancels the appointment."""
        self.status = "Cancelled"
        self.save()

        # Free up the TimeSlot
        if self.time_slot:
            self.time_slot.is_booked = False
            self.time_slot.save()
            self.time_slot = None  # Remove association
            self.save()

    def complete_appointment_with_ehr(self,ehr_data):
        
        """Handle the creation of EHR when appointment is Completed."""
        if self.status != 'Completed':  # Ensure appointment is not already completed
            

            # Create EHR for the patient
            ehr_record = EHR.objects.create(
                patient=self.patient,  # Assuming patient is available through the Appointment model
                visit_date=self.time_slot.slot_date,  # Make sure this exists in Appointment model
                category=ehr_data[0],  # Access category as a dictionary key
                consulted_by=f"{self.doctor.user.first_name} {self.doctor.user.last_name}",
                
                # Initialize fields with default empty values or placeholders
                medical_conditions=ehr_data[1],  # Access as dictionary
                current_medications=ehr_data[2],  # Access as dictionary
                immunization_records=ehr_data[3],  # Access as dictionary
                recommended_lab_test=ehr_data[7],  # Access as dictionary
                # nail_image_analysis=ehr_data.nail_image_analysis,  # Access as dictionary
                # test_results=ehr_data.test_results,  # Access as dictionary
                diagnoses=ehr_data[4],  # Access as dictionary
                comments=ehr_data[5],  # Access as dictionary
                family_history=ehr_data[6]  # Access as dictionary
            )
            # Link the EHR record to the appointment
            self.ehr = ehr_record
            self.mark_completed()
            self.save()

            return True
        return False
    
    def reschedule_time_slot(self, slot_id):
        """
        Handles the reallocation of time slots when an appointment is rescheduled.
        Ensures that:
        - The previous time slot is freed up.
        - A new available time slot is allocated.
        - Conflicts are checked to prevent double bookings.
        """
        try:
            # Get the new time slot
            new_slot = TimeSlot.objects.filter(id=slot_id, is_booked=False).first()

            if not new_slot:
                raise ValueError("The selected time slot is either unavailable or already booked.")

            # Free up the old time slot
            if self.time_slot:
                self.time_slot.is_booked = False
                self.time_slot.save()

            # Assign the new time slot
            new_slot.is_booked = True
            new_slot.save()
            self.time_slot = new_slot

            # Update appointment status
            self.status = "Rescheduled"
            self.save()

            return True  # Successfully rescheduled

        except Exception as e:
            print(f"Error while rescheduling: {e}")
            return False  # Rescheduling failed



    def __str__(self):
        return f"Appointment {self.appointment_id} - {self.patient}"

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
        ehr(OneToOneField): Links every appointment with a new EHR record.
    """
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="doctor_appointments")
    appointment_type = models.CharField(max_length=50)
    
    follow_up = models.BooleanField(default=False)
    fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    recommended_tests = models.JSONField(null=True,blank=True)
    
    # Field for linking every appointment with EHR record
    ehr = models.OneToOneField(EHR,on_delete=models.SET_NULL,blank=True, null=True,related_name="doc_appointment_ehr")
    
    def save(self, *args, **kwargs):
        """Sets the fee dynamically based on the appointment type."""
        if not self.fee:
            self.fee = DoctorAppointmentFee.get_fee(self.appointment_type) or 0.00
        super().save(*args, **kwargs)
    


class TechnicianAppointment(Appointment):
    """
    Represents an appointment for a laboratory technician.

    Attributes:
        lab_technician (ForeignKey): The lab technician assigned to the appointment.
        lab_tests (ManyToManyField): The lab tests linked to this appointment.
        fee (DecimalField): The total fee for the lab tests in this appointment.
        ehr (OneToOneField): The EHR record linked to this appointment.
    """

    # Technician responsible for the appointment
    lab_technician = models.ForeignKey(
        LabTechnician, 
        on_delete=models.CASCADE, 
        related_name="technician_appointments"
    )

    # The total fee for all selected lab tests (calculated or manually set)
    fee = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True
    )

    # Links the appointment with a corresponding EHR record
    ehr = models.OneToOneField(
        EHR, 
        on_delete=models.SET_NULL, 
        blank=True, 
        null=True, 
        related_name="tech_appointment_ehr"
    )

    def calculate_fee(self):
        """
        Calculates the total fee for the appointment by summing up 
        the prices of all associated lab tests.

        If a fee is already set manually, it will not override it.

        Returns:
            float: The calculated total fee for the lab tests.
        """
        if not self.fee:  # Only calculate if no manual fee is set
            self.fee = self.lab_tests.aggregate(total=models.Sum('price'))['total'] or 0
            self.save()
        return self.fee

    # def save(self,*args,**kwargs):
    #     self.fee = self.calculate_fee()
    #     super().save(*args,**kwargs)
        
    def __str__(self):
        """
        String representation of the TechnicianAppointment instance.
        
        Returns:
            str: Readable format showing the appointment ID and technician.
        """
        return f"Lab Appointment #{self.id} - Technician: {self.lab_technician}"

   
# from django.db import models
# from django.contrib.auth import get_user_model

# User = get_user_model()

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
    


