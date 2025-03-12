import django
import os
from datetime import datetime, timedelta
from django.utils.timezone import make_aware

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "your_project.settings")
django.setup()

from appointments.models import TimeSlot
from users.models import Doctor

# Configuration: Define slots to add
DOCTOR_ID = "DOC001"  # Change to match a real doctor in your DB
START_DATE = datetime.today().date()  # Start adding slots from today
DAYS_TO_ADD = 7  # Generate slots for 7 days
TIME_INTERVALS = [("09:00", "09:30"), ("10:00", "10:30"), ("11:00", "11:30")]  # Customize slot times

def add_time_slots():
    """
    Adds time slots for a specific doctor over multiple days.
    """
    try:
        doctor = Doctor.objects.get(user_id=DOCTOR_ID)  # Ensure the doctor exists
    except Doctor.DoesNotExist:
        print(f"Doctor with ID {DOCTOR_ID} not found!")
        return

    created_slots = []

    for day_offset in range(DAYS_TO_ADD):
        slot_date = START_DATE + timedelta(days=day_offset)

        for start_time, end_time in TIME_INTERVALS:
            start_time = make_aware(datetime.strptime(f"{slot_date} {start_time}", "%Y-%m-%d %H:%M"))
            end_time = make_aware(datetime.strptime(f"{slot_date} {end_time}", "%Y-%m-%d %H:%M"))

            slot, created = TimeSlot.objects.get_or_create(
                doctor=doctor,
                slot_date=slot_date,
                start_time=start_time,
                end_time=end_time,
                defaults={"is_booked": False},
            )
            if created:
                created_slots.append(slot)

    print(f"✅ Added {len(created_slots)} time slots successfully!")

# Run the script
add_time_slots()
