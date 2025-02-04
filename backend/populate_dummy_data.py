import random
from datetime import datetime, timedelta
from faker import Faker
from users.models import CustomUser, Patient, Doctor, LabTechnician
from appointments.models import DoctorAppointment, TechnicianAppointment
from django.utils import timezone

fake = Faker()

# Generate dummy patients
def create_dummy_patients(num_patients):
    patients = []
    for _ in range(num_patients):
        user = CustomUser.objects.create_user(
            email=f"patient{fake.unique.random_number(digits=5)}@example.com",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password="password123",
            role="patient",
        )
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
    for _ in range(num_doctors):
        user = CustomUser.objects.create_user(
            email=f"doctor{fake.unique.random_number(digits=5)}@example.com",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password="password123",
            role="doctor",
        )
        doctor = Doctor.objects.create(
            user=user,
            license_number=fake.unique.random_number(digits=6),
            specialization=fake.word(),
            qualifications=fake.text(),
            medical_degree=fake.word(),
            years_of_experience=random.randint(1, 30),
            consultation_fee=random.uniform(50, 200),
            emergency_contact=fake.phone_number(),
        )
        doctors.append(doctor)
    return doctors

# Generate dummy appointments
def generate_dummy_appointments(num_appointments, patients, doctors):
    for _ in range(num_appointments):
        patient = random.choice(patients)
        doctor = random.choice(doctors)
        appointment_date = fake.date_between(start_date="today", end_date="+30d")
        appointment_time = fake.time()

        doctor_appointment = DoctorAppointment.objects.create(
            patient=patient,  # Assigning Patient instance
            doctor=doctor,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            appointment_type=random.choice(["Consultation", "Follow-up"]),
            specialization=doctor.specialization,
            consultation_fee=doctor.consultation_fee,
        )

# Create dummy data
num_patients = 10
num_doctors = 5
num_appointments = 20

patients = create_dummy_patients(num_patients)
doctors = create_dummy_doctors(num_doctors)
generate_dummy_appointments(num_appointments, patients, doctors)
