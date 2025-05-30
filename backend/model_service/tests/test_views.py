import pytest
from rest_framework.test import APIClient
from users.models import CustomUser, Patient, Doctor, ClinicAdmin


@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def patient_user():
    user = CustomUser.objects.create_user(
        email="patient@example.com",
        password="testpass123",
        first_name="Pat",
        last_name="Ient",
        role="patient"
    )
    Patient.objects.create(
        user=user,
        date_of_birth="1980-01-01",
        gender="M",
        emergency_contact="1234567890"
    )
    return user

@pytest.fixture
def doctor_user():
    user = CustomUser.objects.create_user(
        email="doctor@example.com",
        password="docpass123",
        first_name="Doc",
        last_name="Tor",
        role="doctor"
    )
    Doctor.objects.create(
        user=user,
        license_number="DOC123456",
        specialization="Cardiology",
        qualifications="MBBS, MD",
        medical_degree="MD Cardiology",
        years_of_experience=10,
        emergency_contact="0987654321"
    )
    return user

@pytest.fixture
def clinic_admin_user():
    user = CustomUser.objects.create_user(
        email="clinicadmin@example.com",
        password="adminpass123",
        first_name="Clinic",
        last_name="Admin",
        role="clinic_admin"
    )
    ClinicAdmin.objects.create(user=user)
    return user

@pytest.mark.django_db
def test_get_patient_user_detail(api_client, clinic_admin_user, patient_user):
    api_client.force_authenticate(user=clinic_admin_user)
    url = reverse('user-detail', kwargs={"pk": patient_user.user_id})
    response = api_client.get(url)
    assert response.status_code == 200
    assert response.data["email"] == patient_user.email
    assert response.data["role"] == "patient"
