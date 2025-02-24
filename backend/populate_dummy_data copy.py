import random
from datetime import datetime, timedelta
from faker import Faker
from users.models import CustomUser, Patient, Doctor, LabTechnician, ClinicAdmin, LabAdmin
from appointments.models import DoctorAppointment, TechnicianAppointment, LabTechnicianAppointmentFee, DoctorAppointmentFee
from django.utils import timezone

fake = Faker()

# Generate dummy users
def create_dummy_users(num_users, role):
    users = []
    for _ in range(num_users):
        email = f"{role}{fake.unique.random_number(digits=3)}@example.com"
        user = CustomUser.objects.create_user(
            email=email,
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=role,
            role=role,
        )
        users.append(user)
    return users

# Generate dummy patients
def create_dummy_patients(num_patients):
    patients = []
    users = create_dummy_users(num_patients, "patient")
    for user in users:
        patient = Patient.objects.create(
            user=user,
            date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=80),
            gender=random.choice(['M', 'F']),
            address=fake.address(),
            medical_history={},
            emergency_contact=fake.phone_number(),
        )
        patients.append(patient)
    return patients

# Generate dummy doctors
def create_dummy_doctors(num_doctors):
    doctors = []
    users = create_dummy_users(num_doctors, "doctor")
    for user in users:
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

# Generate dummy clinic admins
def create_dummy_clinic_admins(num_admins):
    email = f"clinic_admin{fake.unique.random_int(min=1000, max=9999)}@example.com"
    # Check if a CustomUser with this email already exists
    user, created = CustomUser.objects.get_or_create(
        email=email,
        defaults={
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "password": "cli",
            "role": "clinic_admin",
        }
    )
    clinic_admin, created = ClinicAdmin.objects.get_or_create(
        user=user,
    )
    return clinic_admin 

# Generate dummy lab admins
def create_dummy_lab_admins(num_admins):
    email = f"lab_admin{fake.unique.random_int(min=1000, max=9999)}@example.com"

    # Check if a CustomUser with this email already exists
    user, created = CustomUser.objects.get_or_create(
        email=email,
        defaults={
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "password": "lab",
            "role": "lab_admin",
        }
    )

    # Create a unique license number
    license_number = f"LIC-{fake.unique.random_int(min=100000, max=999999)}"

    # Create or get the LabAdmin instance
    lab_admin, created = LabAdmin.objects.get_or_create(
        user=user,
        defaults={
            "license_number": license_number,
            "designation": fake.job(),
            "qualifications": fake.text(max_nb_chars=100),
            "years_of_experience": fake.random_int(min=1, max=30),
            "specialization": fake.word(),
            "emergency_contact": fake.phone_number(),
        }
    )

    return lab_admin


# Generate dummy lab technicians
def create_dummy_lab_technicians(num_technicians):
    technicians = []
    users = create_dummy_users(num_technicians, "lab_technician")
    for user in users:
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

# Generate dummy doctor appointments
def generate_dummy_doctor_appointments(num_appointments, patients, doctors):
    for _ in range(num_appointments):
        patient = random.choice(patients)
        doctor = random.choice(doctors)
        DoctorAppointment.objects.create(
            patient=patient,
            doctor=doctor,
            appointment_date=fake.date_between(start_date="today", end_date="+30d"),
            appointment_time=fake.time(),
            appointment_type=random.choice(["Consultation", "Follow-up"]),
            specialization=doctor.specialization,
            fee=random.uniform(50, 200),
        )

# Generate dummy lab technician appointments
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
            lab_test_id=random.randint(1000, 9999),
            lab_test_type=lab_test_type,
            test_status=test_status,
            results_available=test_status in ["Results Uploaded", "Results Updated"],
            appointment_date=fake.date_between(start_date="today", end_date="+30d"),
            appointment_time=fake.time(),
            fee=fee,
        )

# Define appointment fees
APPOINTMENT_FEES = {
    "Consultation": 1500.00,
    "Follow-up": 1000.00,
    "Routine Checkup": 1200.00,
    "Emergency Visit": 2000.00,
    "Prescription Refill": 800.00,
}

# Insert or update doctor appointment fees
def populate_doctor_appointment_fees():
    for appointment_type, fee in APPOINTMENT_FEES.items():
        DoctorAppointmentFee.objects.update_or_create(
            appointment_type=appointment_type, defaults={"fee": fee}
        )

# Define lab test fees
LAB_TEST_FEES = {
    "Complete Blood Count (CBC)": 1500.00,
    "Basic Metabolic Panel (BMP)": 1200.00,
    "Hemoglobin A1c (HbA1c)": 1300.00,
    "Testosterone Test": 2000.00,
    "PCR Test": 2500.00,
    "BRCA Gene Test": 3000.00,
}

# Insert or update lab technician appointment fees
def populate_lab_appointment_fees():
    for lab_test_type, fee in LAB_TEST_FEES.items():
        LabTechnicianAppointmentFee.objects.update_or_create(
            lab_test_type=lab_test_type, defaults={"fee": fee}
        )

# Run script to generate dummy data
num_patients = 5
num_doctors = 2
num_lab_technicians = 2
num_clinic_admins = 1
num_lab_admins = 1
num_doctor_appointments = 10
num_lab_appointments = 10

patients = create_dummy_patients(num_patients)
doctors = create_dummy_doctors(num_doctors)
lab_technicians = create_dummy_lab_technicians(num_lab_technicians)
create_dummy_clinic_admins(num_clinic_admins)
create_dummy_lab_admins(num_lab_admins)

generate_dummy_doctor_appointments(num_doctor_appointments, patients, doctors)
generate_dummy_lab_appointments(num_lab_appointments, patients, lab_technicians)

populate_doctor_appointment_fees()
populate_lab_appointment_fees()
