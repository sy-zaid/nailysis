import random
from faker import Faker
from datetime import datetime, timedelta
from users.models import  Doctor, LabTechnician  # Update with your actual app name
from appointments.models import TimeSlot

# fake = Faker()

# def generate_dummy_time_slots(num_slots=10):
#     """Generate and insert dummy TimeSlot records."""
    
#     doctors = list(Doctor.objects.all())  # Fetch available doctors
#     lab_technicians = list(LabTechnician.objects.all())  # Fetch available lab technicians
    
#     if not doctors and not lab_technicians:
#         print("No doctors or lab technicians found. Add some first!")
#         return
    
#     created_slots = []

#     for _ in range(num_slots):
#         slot_date = fake.date_between(start_date="today", end_date="+30d")  # Random future date
#         start_hour = random.randint(8, 17)  # Clinic open hours (8 AM - 5 PM)
#         start_time = datetime.strptime(f"{start_hour}:00", "%H:%M").time()
#         end_time = (datetime.combine(datetime.today(), start_time) + timedelta(hours=1)).time()  # 1-hour slots
        
#         is_booked = fake.boolean(chance_of_getting_true=30)  # 30% chance of being booked

#         assigned_doctor = random.choice(doctors) if doctors and random.choice([True, False]) else None
#         assigned_lab_tech = random.choice(lab_technicians) if lab_technicians and not assigned_doctor else None

#         time_slot = TimeSlot.objects.create(
#             doctor=assigned_doctor,
#             lab_technician=assigned_lab_tech,
#             slot_date=slot_date,
#             start_time=start_time,
#             end_time=end_time,
#             is_booked=is_booked
#         )

#         created_slots.append(time_slot)

#     print(f"✅ {len(created_slots)} dummy time slots added successfully!")

# # Run the function to insert dummy data
# generate_dummy_time_slots(15)  # Generates 15 random slots


