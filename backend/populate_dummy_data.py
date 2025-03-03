import random
from datetime import datetime, timedelta
from faker import Faker
from users.models import CustomUser, Patient, Doctor, LabTechnician,ClinicAdmin,LabAdmin
from appointments.models import DoctorAppointment, TechnicianAppointment, LabTechnicianAppointmentFee, DoctorAppointmentFee
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

# Generate dummy clinic_admin
def create_dummy_clinic_admin(num_clinic_admin):
    clinic_admin = []
    for _ in range(num_clinic_admin):
        user = CustomUser.objects.create_user(
            email=f"clinic_admin{fake.unique.random_number(digits=1)}@example.com",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password="cli",
            role="clinic_admin",
        )
        clinic_admin = ClinicAdmin.objects.create(
            user=user,
        )
        clinic_admin.append(clinic_admin)
    return clinic_admin

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
num_lab_appointments = 10
num_lab_technicians = 3
patients = create_dummy_patients(num_patients)
doctors = create_dummy_doctors(num_doctors)

generate_dummy_appointments(num_appointments, patients, doctors)
generate_dummy_ehr_records(num_ehr_records, patients, doctors)
# Run the function
populate_doctor_appointment_fees()

def create_dummy_users(num_users, role,password):
    users = []
    for _ in range(num_users):
        email = f"{role}{fake.unique.random_number(digits=3)}@example.com"
        user = CustomUser.objects.create_user(
            email=email,
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=password,
            role=role,
        )
        users.append(user)
    return users

def create_dummy_lab_technicians(num_technicians):
    technicians = []
    users = create_dummy_users(num_technicians, "lab_technician",password="tech")
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

lab_technicians = create_dummy_lab_technicians(num_lab_technicians)

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

generate_dummy_lab_appointments(num_lab_appointments, patients, lab_technicians)

# Generate dummy clinic_admin
def create_dummy_clinic_admin():
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

create_dummy_clinic_admin()