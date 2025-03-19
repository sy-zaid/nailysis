import random
from datetime import datetime, timedelta
from faker import Faker
from users.models import CustomUser, Patient, Doctor, LabTechnician,ClinicAdmin,LabAdmin
from appointments.models import DoctorAppointment, TechnicianAppointment, DoctorAppointmentFee
from ehr.models import EHR
from labs.models import LabTestType
from django.utils import timezone
from appointments.models import DoctorAppointmentFee

fake = Faker()

# Define lab test fees
LAB_TEST_FEES = {
    "Complete Blood Count (CBC)": 1500.00,
    "Basic Metabolic Panel (BMP)": 1200.00,
    "Hemoglobin A1c (HbA1c)": 1300.00,
    "Testosterone Test": 2000.00,
    "PCR Test": 2500.00,
    "BRCA Gene Test": 3000.00,
}

# List of appointment types with sample fees
APPOINTMENT_FEES = {
    "Consultation": 1500.00,
    "Follow-up": 1000.00,
    "Routine Checkup": 1200.00,
    "Emergency Visit": 2000.00,
    "Prescription Refill": 800.00,
}

def create_superadmin():
    email = "admin@gmail.com"
    
    user, created = CustomUser.objects.get_or_create(
        email=email,
        defaults={
            "first_name": "Ad",
            "last_name": "Min",
            "role": "system_admin",
            "is_staff": True,
            "is_superuser": True,
        }
    )

    if created:
        user.set_password("admin")  # Hash password manually
        user.save()
        print("Superadmin created successfully!")
    else:
        print("Superadmin already exists.")

# Generate dummy patients
def create_dummy_patients(num_patients):
    patients = []
    for _ in range(num_patients):
        user = CustomUser.objects.create_user(
            email=f"patient{_}@example.com",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password="pat",
            role="patient",
        )
        patient = Patient.objects.create(
            user=user,
            date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=80),
            gender=random.choice(['M', 'F']),
            address=fake.address(),
            # medical_history={},
            emergency_contact=fake.phone_number(),
        )
        patients.append(patient)
    return patients

# Generate dummy doctors
def create_dummy_doctors(num_doctors):
    doctors = []
    for _ in range(num_doctors):
        user = CustomUser.objects.create_user(
            email=f"doctor{_}@example.com",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password="doc",
            role="doctor",
        )
        doctor = Doctor.objects.create(
            user=user,
            license_number=fake.unique.random_number(digits=6),
            specialization=fake.job(),
            qualifications=fake.text(),
            medical_degree=fake.word(),
            years_of_experience=random.randint(1, 30),
            emergency_contact=fake.phone_number(),
        )
        doctors.append(doctor)
    return doctors

def create_dummy_lab_technicians(num_technicians):
    technicians = []
    for _ in range(num_technicians):
        user = CustomUser.objects.create_user(
            email=f"lab_technician{_}@example.com",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password="tech",
            role="lab_technician",
        )
        technician = LabTechnician.objects.create(
            user=user,
            license_number=fake.unique.random_number(digits=6),
            specialization="Laboratory Testing",
            years_of_experience=random.randint(1, 30),
            lab_skills=fake.text(),
            shift_timings={"Morning": "8AM-2PM", "Evening": "2PM-8PM"},
            emergency_contact=fake.phone_number(),
        )
        technicians.append(technician)
    return technicians


# Generate dummy appointments
def generate_dummy_appointments(num_appointments, patients, doctors):
    for _ in range(num_appointments):
        patient = random.choice(patients)
        doctor = random.choice(doctors)
        appointment_date = fake.date_between(start_date="today", end_date="+30d")
        start_time = fake.time()

        doctor_appointment = DoctorAppointment.objects.create(
            patient=patient,  # Assigning Patient instance
            doctor=doctor,
            appointment_date=appointment_date,
            start_time=start_time,
            appointment_type=random.choice(["Consultation", "Follow-up"]),
            specialization=doctor.specialization,
            fee=random.uniform(50, 200),  # Set fee for each appointment
        )


# Function to insert or update appointment fees
def populate_doctor_appointment_fees():
    for appointment_type, fee in APPOINTMENT_FEES.items():
        fee_obj, created = DoctorAppointmentFee.objects.update_or_create(
            appointment_type=appointment_type, defaults={"fee": fee}
        )
        if created:
            print(f"Added: {appointment_type} with fee {fee} PKR")
        else:
            print(f"Updated: {appointment_type} with new fee {fee} PKR")

# Generate dummy EHR records separately
def generate_dummy_ehr_records(num_records, patients, doctors):
    for _ in range(num_records):
        patient = random.choice(patients)
        doctor = random.choice(doctors)
        visit_date = fake.date_between(start_date="-30d", end_date="today")

        ehr_record = EHR.objects.create(
            patient=patient,
            medical_conditions=[fake.word(), fake.word()],  # ✅ Convert set to list
            current_medications=[fake.word(), fake.word()],  # ✅ Convert set to list
            immunization_records=[fake.word(), fake.word()],  # ✅ Convert set to list
            nail_image_analysis=["Normal"],  # ✅ Convert set to list
            test_results=[fake.word(), fake.word()],  # ✅ Convert set to list
            diagnoses=[fake.word(), fake.word()],  # ✅ Convert set to list
            visit_date=visit_date,
            category=random.choice(["Chronic", "Emergency", "Preventive", "General"]),
            comments=fake.text(),
            family_history=fake.text(),
            consulted_by=f"{doctor.user.first_name} {doctor.user.last_name}",
        )

        print(f"EHR record created for {patient.user.first_name}, consulted by Dr. {doctor.user.first_name}")


def generate_dummy_lab_appointments(num_appointments, patients, lab_technicians):
    LAB_TEST_TYPES = [
        "Complete Blood Count (CBC)", "Basic Metabolic Panel (BMP)", "Hemoglobin A1c (HbA1c)", "Testosterone Test",
        "PCR Test", "BRCA Gene Test"
    ]
    for _ in range(num_appointments):
        patient = random.choice(patients)
        technician = random.choice(lab_technicians)
        lab_test_type = random.choice(LAB_TEST_TYPES)
        test_status = random.choice(["Pending", "Sample Collected", "Results Uploaded", "Results Updated"])
        fee = LabTechnicianAppointmentFee.get_fee(lab_test_type) or 1000.00  # Default fee if not found
        TechnicianAppointment.objects.create(
            patient=patient,
            lab_technician=technician,
            lab_test_type=lab_test_type,
            test_status=test_status,
            results_available=test_status in ["Results Uploaded", "Results Updated"],
            appointment_date=fake.date_between(start_date="today", end_date="+30d"),
            start_time=fake.time(),
            fee=fee,
        )

# Generate dummy clinic_admin
def create_dummy_clinic_admin():
    email = f"clinic_admin0@example.com"
    
    user, created = CustomUser.objects.get_or_create(
        email=email,
        defaults={
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "role": "clinic_admin",
        }
    )

    if created:
        user.set_password("cli")  # 🔹 Hash password manually
        user.save()

    clinic_admin, _ = ClinicAdmin.objects.get_or_create(user=user)

    return clinic_admin


# POPULATING LAB APPOINTMENTS FEE MODEL
# Insert or update lab technician appointment fees
def populate_lab_appointment_fees():
    for lab_test_type, fee in LAB_TEST_FEES.items():
        LabTechnicianAppointmentFee.objects.update_or_create(
            lab_test_type=lab_test_type, defaults={"fee": fee}
        )
        


def populate_lab_test_types():
    """
    Populates the LabTestType model with predefined test types.
    """
    test_types = [
        {"name": "CBC", "label": "Complete Blood Count (CBC)", "category": "Blood Test", "price": 500.00},
        {"name": "BloodSugar", "label": "Blood Sugar Test", "category": "Blood Test", "price": 300.00},
        {"name": "HbA1c", "label": "HbA1c (Diabetes Test)", "category": "Blood Test", "price": 700.00},
        {"name": "LipidProfile", "label": "Lipid Profile (Cholesterol Test)", "category": "Blood Test", "price": 1000.00},
        {"name": "Thyroid", "label": "Thyroid Function Test (T3, T4, TSH)", "category": "Blood Test", "price": 1200.00},
        {"name": "UrineTest", "label": "Urine Analysis", "category": "Urine Test", "price": 400.00},
        {"name": "LiverFunction", "label": "Liver Function Test (LFT)", "category": "Blood Test", "price": 1500.00},
        {"name": "KidneyFunction", "label": "Kidney Function Test (KFT)", "category": "Blood Test", "price": 1300.00},
        {"name": "Electrolytes", "label": "Electrolyte Panel", "category": "Blood Test", "price": 800.00},
        {"name": "CRP", "label": "C-Reactive Protein (CRP) Test", "category": "Blood Test", "price": 600.00},
        {"name": "VitaminD", "label": "Vitamin D Test", "category": "Blood Test", "price": 1100.00},
        {"name": "VitaminB12", "label": "Vitamin B12 Test", "category": "Blood Test", "price": 950.00},
        {"name": "IronPanel", "label": "Iron Panel (Ferritin, TIBC)", "category": "Blood Test", "price": 1250.00},
        {"name": "GeneticTest", "label": "Genetic Testing", "category": "Genetic Test", "price": 5000.00},
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


# Create dummy data of everything
num_patients = 5
num_doctors = 2
num_appointments = 5
num_ehr_records = 7  # Independent number of EHR records
num_lab_appointments = 10
num_lab_technicians = 3
patients = create_dummy_patients(num_patients)
doctors = create_dummy_doctors(num_doctors)
lab_technicians = create_dummy_lab_technicians(num_lab_technicians)
clinic_admin = create_dummy_clinic_admin()

# Run the function
# generate_dummy_appointments(num_appointments, patients, doctors)
generate_dummy_ehr_records(num_ehr_records, patients, doctors)
populate_doctor_appointment_fees()
# populate_lab_appointment_fees()
# generate_dummy_lab_appointments(num_lab_appointments, patients, lab_technicians)

create_superadmin()