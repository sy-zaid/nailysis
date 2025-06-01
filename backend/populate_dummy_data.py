import random
from datetime import datetime, timedelta
from faker import Faker
from users.models import CustomUser, Patient, Doctor, LabTechnician, ClinicAdmin, LabAdmin
from appointments.models import DoctorAppointment, TechnicianAppointment, DoctorAppointmentFee, TimeSlot
from ehr.models import EHR
from feedbacks.models import Feedback, FeedbackResponse
from labs.models import LabTestType
from django.utils import timezone

fake = Faker()

SPECIALIZATIONS = [
    "Dermatologist", "Skin Care", "General Physician", "Cardiologist",
    "Endocrinologist", "Neurologist", "Orthopedic", "Pediatrician"
]

APPOINTMENT_FEES = {
    "Consultation": 1500.00,
    "Follow-up": 1000.00,
    "Routine Checkup": 1200.00,
    "Emergency Visit": 2000.00,
    "Prescription Refill": 800.00,
}

LAB_TEST_FEES = {
    "CBC": 1500.00,
    "BloodSugar": 1200.00,
    "HbA1c": 1300.00,
    "PCR Test": 2500.00,
    "BRCA Gene Test": 3000.00,
}

def create_superadmin():
    user, created = CustomUser.objects.get_or_create(
        email="admin@gmail.com",
        defaults={
            "first_name": "Ad",
            "last_name": "Min",
            "role": "system_admin",
            "is_staff": True,
            "is_superuser": True,
        }
    )
    if created:
        user.set_password("admin")
        user.save()
        print(" Superadmin created.")
    else:
        print("⚠️ Superadmin already exists.")

def create_dummy_patients(n):
    patients = []
    for i in range(n):
        user = CustomUser.objects.create_user(
            email=f"patient{i}@example.com",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password="pat",
            role="patient",
            date_joined=timezone.now()
        )
        patient = Patient.objects.create(
            user=user,
            date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=75),
            gender=random.choice(['M', 'F']),
            address=fake.address(),
            emergency_contact=fake.phone_number(),
        )
        patients.append(patient)
    return patients

def create_dummy_doctors(n):
    doctors = []
    for i in range(n):
        user = CustomUser.objects.create_user(
            email=f"doctor{i}@example.com",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password="doc",
            role="doctor",
            date_joined=timezone.now()
        )
        doctor = Doctor.objects.create(
            user=user,
            license_number=fake.unique.random_number(digits=6),
            specialization=random.choice(SPECIALIZATIONS),
            qualifications=fake.text(max_nb_chars=50),
            medical_degree="MBBS",
            years_of_experience=random.randint(3, 25),
            emergency_contact=fake.phone_number(),
        )
        doctors.append(doctor)
    return doctors

def create_dummy_lab_technicians(n):
    techs = []
    for i in range(n):
        user = CustomUser.objects.create_user(
            email=f"labtech{i}@example.com",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password="tech",
            role="lab_technician",
            date_joined=timezone.now()
        )
        tech = LabTechnician.objects.create(
            user=user,
            license_number=fake.unique.random_number(digits=6),
            specialization="Lab Testing",
            years_of_experience=random.randint(2, 15),
            lab_skills=fake.text(max_nb_chars=40),
            shift_timings={"Morning": "8AM-2PM", "Evening": "2PM-8PM"},
            emergency_contact=fake.phone_number(),
        )
        techs.append(tech)
    return techs

def generate_time_slots_doc(n=50):
    doctors = Doctor.objects.all()
    for _ in range(n):
        slot_date = fake.date_between(start_date="today", end_date="+15d")
        start_hour = random.randint(8, 17)
        start_time = datetime.strptime(f"{start_hour}:00", "%H:%M").time()
        end_time = (datetime.combine(datetime.today(), start_time) + timedelta(hours=1)).time()
        is_booked = fake.boolean(chance_of_getting_true=30)

        doctor = random.choice(doctors)

        TimeSlot.objects.create(
            doctor=doctor,
            slot_date=slot_date,
            start_time=start_time,
            end_time=end_time,
            is_booked=is_booked,
        )

def generate_time_slots_tech(n=50):
    technicians = LabTechnician.objects.all()
    for _ in range(n):
        slot_date = fake.date_between(start_date="today", end_date="+15d")
        start_hour = random.randint(8, 17)
        start_time = datetime.strptime(f"{start_hour}:00", "%H:%M").time()
        end_time = (datetime.combine(datetime.today(), start_time) + timedelta(hours=1)).time()
        is_booked = fake.boolean(chance_of_getting_true=30)

        technician = random.choice(technicians)

        TimeSlot.objects.create(
            lab_technician=technician,
            slot_date=slot_date,
            start_time=start_time,
            end_time=end_time,
            is_booked=is_booked,
        )        

def populate_doctor_fees():
    for appt_type, fee in APPOINTMENT_FEES.items():
        DoctorAppointmentFee.objects.update_or_create(
            appointment_type=appt_type,
            defaults={"fee": fee}
        )

# def generate_doctor_appointments(patients, n=10):
#     appointment_types = list(APPOINTMENT_FEES.keys())
#     available_slots = TimeSlot.objects.filter(doctor__isnull=False, is_booked=False)

#     if not available_slots.exists():
#         print("⚠️ No available doctor time slots to book.")
#         return

#     for _ in range(n):
#         patient = random.choice(patients)
#         slot = random.choice(available_slots)
#         appointment_type = random.choice(appointment_types)

#         DoctorAppointment.objects.create(
#             patient=patient,
#             doctor=slot.doctor,
#             appointment_date=slot.slot_date,  # Correct field name
#             time_slot=slot,  # Assuming time_slot is a CharField
#             appointment_type=appointment_type,
#             status="booked",
#             notes=fake.sentence()
#         )

#         # Mark slot as booked
#         slot.is_booked = True
#         slot.save()


# def generate_lab_appointments(patients, n=10):
#     test_types = LabTestType.objects.all()
#     available_slots = TimeSlot.objects.filter(lab_technician__isnull=False, is_booked=False)

#     if not available_slots.exists():
#         print("⚠️ No available lab technician time slots to book.")
#         return

#     for _ in range(n):
#         patient = random.choice(patients)
#         slot = random.choice(available_slots)
#         test_type = random.choice(test_types)

#         TechnicianAppointment.objects.create(
#             patient=patient,
#             lab_technician=slot.lab_technician,
#             appointment_date=slot.slot_date,
#             time_slot=slot,
#             test_type=test_type,
#             status="booked",
#             notes=fake.sentence()
#         )

#         slot.is_booked = True
#         slot.save()


def generate_ehr_records(patients, doctors, n=10):
    medical_conditions_choices = ["None", "Diabetes", "Hypertension", "Heart Disease", "Asthma"]
    diagnoses_choices = ["Anemia", "Diabetes", "Hypertension", "Fungal Infection"]
    current_medications_choices = ["None", "Metformin", "Aspirin", "Lisinopril", "Atorvastatin"]
    category_choices = ["Chronic", "Emergency", "Preventive", "General"]
    immunization_records = [
    "BCG",            # Bacillus Calmette-Guérin (vaccine for tuberculosis)
    "Hepatitis B",    # Hepatitis B vaccine
    "Polio",          # Polio vaccine
    "DPT",            # Diphtheria, Pertussis (Whooping Cough), and Tetanus vaccine
    "MMR",            # Measles, Mumps, and Rubella vaccine
    "Hepatitis A",    # Hepatitis A vaccine
    "Varicella",      # Chickenpox vaccine
    "Influenza",      # Influenza (Flu) vaccine
    "COVID-19",       # COVID-19 vaccine
    "HPV",            # Human Papillomavirus vaccine
    "Typhoid",        # Typhoid vaccine
    "Rotavirus"       # Rotavirus vaccine
]

    for _ in range(n):
        patient = random.choice(patients)
        doctor = random.choice(doctors)

        EHR.objects.create(
            patient=patient,
            medical_conditions=random.sample(medical_conditions_choices, k=random.randint(1, 2)),
            current_medications=random.sample(current_medications_choices, k=random.randint(1, 2)),
            immunization_records=random.sample(immunization_records, random.randint(1, 2)),
            # nail_image_analysis=random.sample(["Healthy", "Fungal Infection", "Possible Anemia"], k=1),
            # test_results=[random.choice(["Blood Test", "Urine Test"])],
            diagnoses=random.sample(diagnoses_choices, k=1),
            visit_date=fake.date_between(start_date="-15d", end_date="today"),
            category=random.choice(category_choices),
            comments=fake.sentence(),
            family_history=fake.text(max_nb_chars=50),
            consulted_by=f"{doctor.user.first_name} {doctor.user.last_name}",
        )

def generate_dummy_feedback(patients, n=8):
    categories = [
        "Doctor Service", "Appointment Issue", "Billing & Payments",
        "Lab Test Accuracy", "Facilities & Cleanliness", "Technical Issue",
        "Nail Report Issue", "Suggestions and Improvements"
    ]
    for _ in range(n):
        patient = random.choice(patients)
        Feedback.objects.create(
            user=patient.user,
            category=random.choice(categories),
            description=fake.paragraph(),
            is_clinic_feedback=random.choice([True, False])
        )

def create_dummy_clinic_admin():
    user, _ = CustomUser.objects.get_or_create(
        email="clinic_admin@example.com",
        defaults={
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "role": "clinic_admin"
        }
    )
    user.set_password("cli")
    user.save()
    ClinicAdmin.objects.get_or_create(user=user)


def create_dummy_lab_admin():
    user, _ = CustomUser.objects.get_or_create(
        email="lab_admin@example.com",
        defaults={
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "role": "lab_admin"
        }
    )
    user.set_password("lab")
    user.save()
    
    LabAdmin.objects.get_or_create(
        user=user,
        defaults={
            "license_number": fake.unique.random_number(digits=6),
            "designation": "Senior Lab Admin",
            "qualifications": fake.text(),
            "years_of_experience": random.randint(5, 25),
            "specialization": "Laboratory Management",
            "emergency_contact": fake.phone_number(),
        }
    )



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

# === EXECUTE DATA POPULATION === #
num_patients = 5
num_doctors = 3
num_techs = 2

patients = create_dummy_patients(num_patients)
doctors = create_dummy_doctors(num_doctors)
lab_techs = create_dummy_lab_technicians(num_techs)

create_superadmin()
create_dummy_clinic_admin()
create_dummy_lab_admin()
generate_time_slots_doc(60)
generate_time_slots_tech(60)
# generate_doctor_appointments(patients, 8)
# generate_lab_appointments(patients, 6)
populate_doctor_fees()
generate_ehr_records(patients, doctors, 10)
generate_dummy_feedback(patients)
populate_lab_test_types()

print(" Dummy data successfully populated.")
