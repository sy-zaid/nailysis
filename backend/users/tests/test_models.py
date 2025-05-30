import pytest
from users.models import CustomUser, ClinicAdmin, Doctor, Patient, LabAdmin, LabTechnician
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import date

@pytest.mark.django_db
class TestCustomUserModel:

    def test_create_patient_user(self):
        user = CustomUser.objects.create_user(
            email="patient1@example.com",
            password="testpass",
            first_name="John",
            last_name="Doe",
            role="patient"
        )
        assert user.email == "patient1@example.com"
        assert user.role == "patient"
        assert user.user_id.startswith("PAT")
        assert str(user) == user.email

    def test_generate_custom_user_id_format(self):
        user = CustomUser.objects.create_user(
            email="clinic@example.com",
            password="testpass",
            first_name="Admin",
            last_name="One",
            role="clinic_admin"
        )
        assert user.user_id.startswith("CA")

    def test_create_superuser(self):
        superuser = CustomUser.objects.create_superuser(
            email="admin@example.com",
            password="adminpass",
            first_name="Super",
            last_name="User",
            role="system_admin"
        )
        assert superuser.is_superuser
        assert superuser.is_staff
        assert superuser.role == "system_admin"

@pytest.mark.django_db
class TestRoleModels:

    def test_clinic_admin_creation(self):
        user = CustomUser.objects.create_user(
            email="clinicadmin@example.com",
            password="pass",
            first_name="Alice",
            last_name="Admin",
            role="clinic_admin"
        )
        ClinicAdmin.objects.create(user=user)
        assert user.clinic_admin is not None
        assert str(user.clinic_admin) == f"{user.first_name} {user.last_name}"

    def test_doctor_creation(self):
        user = CustomUser.objects.create_user(
            email="doc@example.com",
            password="pass",
            first_name="Bob",
            last_name="Smith",
            role="doctor"
        )
        doctor = Doctor.objects.create(
            user=user,
            license_number="LIC123",
            specialization="Cardiology",
            qualifications="MBBS, MD",
            medical_degree="MD",
            years_of_experience=10,
            emergency_contact="1234567890"
        )
        assert doctor.specialization == "Cardiology"
        assert str(doctor) == f"{user.first_name} {user.last_name}"

    def test_patient_creation(self):
        user = CustomUser.objects.create_user(
            email="pat@example.com",
            password="pass",
            first_name="Jane",
            last_name="Doe",
            role="patient"
        )
        patient = Patient.objects.create(
            user=user,
            date_of_birth=date(2000, 1, 1),
            gender="F",
            address="123 Main Street",
            emergency_contact="9876543210"
        )
        assert str(patient) == f"{user.first_name} {user.last_name}"

    def test_lab_admin_creation(self):
        user = CustomUser.objects.create_user(
            email="labadmin@example.com",
            password="pass",
            first_name="Lab",
            last_name="Admin",
            role="lab_admin"
        )
        lab_admin = LabAdmin.objects.create(
            user=user,
            license_number="LA001",
            designation="Senior Analyst",
            qualifications="PhD",
            years_of_experience=8,
            specialization="Microbiology",
            emergency_contact="1112223333"
        )
        assert lab_admin.specialization == "Microbiology"

    def test_lab_technician_creation(self):
        user = CustomUser.objects.create_user(
            email="labtech@example.com",
            password="pass",
            first_name="Tech",
            last_name="Nician",
            role="lab_technician"
        )
        lab_tech = LabTechnician.objects.create(
            user=user,
            license_number="LT001",
            specialization="Radiology",
            years_of_experience=4,
            lab_skills="X-Ray, MRI",
            shift_timings={"Monday": "9-5"},
            emergency_contact="4445556666"
        )
        assert lab_tech.lab_skills == "X-Ray, MRI"
        assert lab_tech.specialization == "Radiology"
