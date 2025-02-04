from appointments.models import Appointment
from users.models import Patient
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # Replace with actual settings path
django.setup()

from appointments.models import Appointment  # Import models after setting up Django

from django.contrib.auth import get_user_model
from users.models import Patient

User = get_user_model()

# Create dummy users
user1, created1 = User.objects.get_or_create(user_id=1, defaults={"email": "user1@example.com", "password": "test123"})
user2, created2 = User.objects.get_or_create(user_id=2, defaults={"email": "user2@example.com", "password": "test123"})

# Create dummy patients
patient1, created_patient1 = Patient.objects.get_or_create(user=user1)
patient2, created_patient2 = Patient.objects.get_or_create(user=user2)

print("Dummy patients created!")

# First Appointment
appointment1 = Appointment(
    patient=patient1,
    appointment_date="2025-02-04",
    appointment_time="10:00:00",
    status="Scheduled",
    reminder_sent=False,
    notes="Routine checkup"
)
appointment1.save()

# Second Appointment
appointment2 = Appointment(
    patient=patient2,
    appointment_date="2025-02-05",
    appointment_time="11:30:00",
    status="Completed",
    reminder_sent=True,
    notes="Follow-up after surgery"
)
appointment2.save()

# Third Appointment
appointment3 = Appointment(
    patient=patient1,
    appointment_date="2025-02-06",
    appointment_time="14:00:00",
    status="Cancelled",
    reminder_sent=False,
    notes="Patient canceled the appointment"
)
appointment3.save()
