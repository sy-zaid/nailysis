import random
from datetime import datetime, timedelta
from faker import Faker
from users.models import CustomUser, Patient, Doctor, LabTechnician
from appointments.models import DoctorAppointment, TechnicianAppointment
from ehr.models import EHR
from django.utils import timezone
from appointments.models import DoctorAppointmentFee

fake = Faker()

# Generate dummy patients
def create_dummy_patients(num_patients):
    patients = []
    for _ in range(num_patients):
        user = CustomUser.objects.create_user(
            email=f"patient{fake.unique.random_number(digits=1)}@example.com",
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
            email=f"doctor{fake.unique.random_number(digits=1)}@example.com",
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




# List of appointment types with sample fees
APPOINTMENT_FEES = {
    "Consultation": 1500.00,
    "Follow-up": 1000.00,
    "Routine Checkup": 1200.00,
    "Emergency Visit": 2000.00,
    "Prescription Refill": 800.00,
}

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
            medical_conditions={"conditions": [fake.word(), fake.word()]},
            current_medications={"medications": [fake.word(), fake.word()]},
            immunization_records={"vaccines": [fake.word(), fake.word()]},
            nail_image_analysis={"analysis": "Normal"},
            test_results={"tests": [fake.word(), fake.word()]},
            diagnoses={"diagnoses": [fake.word(), fake.word()]},
            visit_date=visit_date,
            category=random.choice(["Chronic", "Emergency", "Preventive", "General"]),
            comments=fake.text(),
            family_history=fake.text(),
            consulted_by=f"{doctor.user.first_name} {doctor.user.last_name}",
        )

        print(f"EHR record created for {patient.user.first_name}, consulted by Dr. {doctor.user.first_name}")

# Create dummy data
num_patients = 5
num_doctors = 2
num_appointments = 5
num_ehr_records = 7  # Independent number of EHR records

patients = create_dummy_patients(num_patients)
doctors = create_dummy_doctors(num_doctors)
generate_dummy_appointments(num_appointments, patients, doctors)
generate_dummy_ehr_records(num_ehr_records, patients, doctors)
# Run the function
populate_doctor_appointment_fees()
