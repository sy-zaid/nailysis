import pytest 
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from users.models import CustomUser, Doctor, Patient, LabTechnician
from model_bakery import baker

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def authenticated_user():
    user = baker.make(CustomUser, role="patient", email="testuser@example.com")
    user.set_password("testpass123")
    user.save()
    return user

@pytest.fixture
def auth_client(api_client, authenticated_user):
    api_client.login(email=authenticated_user.email, password="testpass123")
    return api_client

@pytest.fixture
def token_auth_client(api_client, authenticated_user):
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(authenticated_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')
    return api_client

@pytest.mark.django_db
class TestDoctorAPIView:
    def test_get_all_doctors(self, token_auth_client):
        baker.make(Doctor, _quantity=3)
        url = reverse('doctor-list')
        response = token_auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

    def test_get_doctors_by_specialization(self, token_auth_client):
        baker.make(Doctor, specialization="Cardiology")
        url = reverse('doctor-list') + '?specialization=Cardiology'
        response = token_auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert all(doc['specialization'] == 'Cardiology' for doc in response.data)

@pytest.mark.django_db
class TestLabTechnicianAPIView:
    def test_get_all_lab_technicians(self, token_auth_client):
        baker.make(LabTechnician, _quantity=2)
        url = reverse('labtechnician-list')
        response = token_auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

    def test_get_lab_technicians_by_specialization(self, token_auth_client):
        baker.make(LabTechnician, specialization="Microbiology")
        url = reverse('labtechnician-list') + '?specialization=Microbiology'
        response = token_auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert all(labtech['specialization'] == 'Microbiology' for labtech in response.data)

@pytest.mark.django_db
class TestPatientAPIView:
    def test_get_patient_data(self, token_auth_client, authenticated_user):
        baker.make(Patient, user=authenticated_user)
        url = reverse('patient-list')
        response = token_auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

@pytest.mark.django_db
class TestUserSerializerView:
    def test_get_authenticated_user_profile(self, token_auth_client, authenticated_user):
        url = reverse('userserializerview-list')
        response = token_auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data[0]['email'] == authenticated_user.email
