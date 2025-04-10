# import random
# from faker import Faker
# from datetime import datetime, timedelta
# from users.models import  Doctor, LabTechnician  # Update with your actual app name
# from appointments.models import TimeSlot

# fake = Faker()

# def generate_dummy_time_slots(num_slots=10):
#     """Generate and insert dummy TimeSlot records."""
    
#     doctors = list(Doctor.objects.all())  # Fetch available doctors
#     lab_technicians = list(LabTechnician.objects.filter(user_id="LT001"))  # Fetch available lab technicians
    
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

#     print(f" {len(created_slots)} dummy time slots added successfully!")

# # Run the function to insert dummy data
# generate_dummy_time_slots(400)  # Generates 15 random slots

from labs.models import LabTestType
def populate_lab_test_types():
    """
    Populates the LabTestType model with predefined test types.
    """
    test_types = [
        # Blood Tests
        {"name": "CBC", "label": "Complete Blood Count (CBC)", "category": "Blood Test", "price": 500.00},
        {"name": "BloodSugar", "label": "Blood Sugar Test", "category": "Blood Test", "price": 300.00},
        {"name": "HbA1c", "label": "HbA1c (Diabetes Test)", "category": "Blood Test", "price": 700.00},
        {"name": "LipidProfile", "label": "Lipid Profile (Cholesterol Test)", "category": "Blood Test", "price": 1000.00},
        {"name": "Thyroid", "label": "Thyroid Function Test (T3, T4, TSH)", "category": "Blood Test", "price": 1200.00},
        {"name": "LiverFunction", "label": "Liver Function Test (LFT)", "category": "Blood Test", "price": 1500.00},
        {"name": "KidneyFunction", "label": "Kidney Function Test (KFT)", "category": "Blood Test", "price": 1300.00},
        {"name": "Electrolytes", "label": "Electrolyte Panel", "category": "Blood Test", "price": 800.00},
        {"name": "CRP", "label": "C-Reactive Protein (CRP) Test", "category": "Blood Test", "price": 600.00},
        {"name": "VitaminD", "label": "Vitamin D Test", "category": "Blood Test", "price": 1100.00},
        {"name": "VitaminB12", "label": "Vitamin B12 Test", "category": "Blood Test", "price": 950.00},
        {"name": "IronPanel", "label": "Iron Panel (Ferritin, TIBC)", "category": "Blood Test", "price": 1250.00},
        
        # Urine Test
        {"name": "UrineTest", "label": "Urine Analysis", "category": "Urine Test", "price": 400.00},
        
        # Imaging Tests
        {"name": "XRay", "label": "X-Ray", "category": "Imaging Test", "price": 2000.00},
        {"name": "MRI", "label": "Magnetic Resonance Imaging (MRI)", "category": "Imaging Test", "price": 10000.00},
        {"name": "CTScan", "label": "Computed Tomography (CT) Scan", "category": "Imaging Test", "price": 7000.00},
        {"name": "Ultrasound", "label": "Ultrasound", "category": "Imaging Test", "price": 3500.00},
        
        # Pathology Reports
        {"name": "Biopsy", "label": "Biopsy", "category": "Pathology Report", "price": 5000.00},
        {"name": "Histopathology", "label": "Histopathology", "category": "Pathology Report", "price": 6000.00},
    ]

    for test in test_types:
        obj, created = LabTestType.objects.get_or_create(
            name=test["name"],
            defaults={
                "label": test["label"],
                "category": test["category"],
                "price": test["price"]
            }
        )
        if created:
            print(f"Added: {obj.label} ({obj.category}) - Rs. {obj.price}")
        else:
            print(f"Already exists: {obj.label}")

populate_lab_test_types()