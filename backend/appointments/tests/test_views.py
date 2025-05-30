import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from appointments.models import (
    DoctorAppointmentFee, TimeSlot, DoctorAppointment, TechnicianAppointment,
    CancellationRequest, TechnicianCancellationRequest
)
from users.models import CustomUser, Doctor, Patient, LabTechnician
from datetime import date, time, timedelta

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_users(db):
    # Create Doctor user and profile
    doctor_user = CustomUser.objects.create_user(
        email='doc1@example.com',
        password='testpass123',
        first_name='Doc',
        last_name='One',
        role='doctor'
    )
    doctor = Doctor.objects.create(
        user=doctor_user,
        license_number='LIC123',
        specialization='Cardiology',
        qualifications='MD',
        medical_degree='MBBS',
        years_of_experience=10,
        emergency_contact='1234567890'
    )

    # Create Patient user and profile
    patient_user = CustomUser.objects.create_user(
        email='patient1@example.com',
        password='testpass123',
        first_name='Pat',
        last_name='One',
        role='patient'
    )
    patient = Patient.objects.create(
        user=patient_user,
        date_of_birth='1990-01-01',
        gender='M',
        emergency_contact='0987654321'
    )

    # Create Lab Technician user and profile
    tech_user = CustomUser.objects.create_user(
        email='tech1@example.com',
        password='testpass123',
        first_name='Tech',
        last_name='One',
        role='lab_technician'
    )
    technician = LabTechnician.objects.create(
        user=tech_user,
        license_number='TECH123',
        specialization='Lab',
        years_of_experience=5,
        lab_skills='Blood tests',
        shift_timings={'start': '09:00', 'end': '17:00'},
        emergency_contact='1122334455'
    )

    return {
        'doctor_user': doctor_user,
        'doctor': doctor,
        'patient_user': patient_user,
        'patient': patient,
        'tech_user': tech_user,
        'technician': technician,
    }

@pytest.fixture
def timeslot(db, create_users):
    return TimeSlot.objects.create(
        doctor=create_users['doctor'],
        day_of_week='Monday',
        start_time=time(9, 0),
        end_time=time(10, 0)
    )

@pytest.mark.django_db
def test_create_doctor_fee(api_client, create_users):
    api_client.force_authenticate(user=create_users['doctor_user'])
    doctor_fee_url = reverse('doctor_fees-list')
    data = {'fee': 500}
    response = api_client.post(doctor_fee_url, data)
    assert response.status_code == 201
    assert DoctorAppointmentFee.objects.filter(doctor=create_users['doctor']).exists()

@pytest.mark.django_db
def test_book_doctor_appointment(api_client, create_users, timeslot):
    api_client.force_authenticate(user=create_users['patient_user'])
    doctor_appointment_url = reverse('doctor_appointments-list')
    data = {
        'doctor': create_users['doctor'].user.user_id,  # FK to Doctor (PK = user_id)
        'date': (date.today() + timedelta(days=1)).isoformat(),
        'time_slot': timeslot.id,
        'purpose': 'General Checkup',
        'notes': 'Test note'
    }
    response = api_client.post(doctor_appointment_url, data)
    assert response.status_code == 201
    assert DoctorAppointment.objects.filter(patient=create_users['patient']).exists()

@pytest.mark.django_db
def test_book_technician_appointment(api_client, create_users):
    api_client.force_authenticate(user=create_users['patient_user'])
    technician_appointment_url = reverse('lab_technician_appointments-list')
    data = {
        'technician': create_users['technician'].user.user_id,  # FK to LabTechnician (user_id PK)
        'date': (date.today() + timedelta(days=2)).isoformat(),
        'time': '11:00',
        'test_type': 'Blood',
        'notes': 'Lab test'
    }
    response = api_client.post(technician_appointment_url, data)
    assert response.status_code == 201
    assert TechnicianAppointment.objects.filter(patient=create_users['patient']).exists()

@pytest.mark.django_db
def test_submit_doctor_cancellation_request(api_client, create_users, timeslot):
    appointment = DoctorAppointment.objects.create(
        patient=create_users['patient'],
        doctor=create_users['doctor'],
        date=date.today() + timedelta(days=1),
        time_slot=timeslot,
        purpose="Test",
        notes="Test"
    )
    api_client.force_authenticate(user=create_users['patient_user'])
    doctor_cancel_url = reverse('cancellation_requests-list')
    data = {
        'appointment': appointment.id,
        'reason': 'Not feeling well'
    }
    response = api_client.post(doctor_cancel_url, data)
    assert response.status_code == 201
    assert CancellationRequest.objects.filter(appointment=appointment).exists()

@pytest.mark.django_db
def test_submit_technician_cancellation_request(api_client, create_users):
    appointment = TechnicianAppointment.objects.create(
        patient=create_users['patient'],
        technician=create_users['technician'],
        date=date.today() + timedelta(days=2),
        time='10:00',
        test_type='X-ray',
        notes='Test'
    )
    api_client.force_authenticate(user=create_users['patient_user'])
    technician_cancel_url = reverse('tech_cancellation_requests-list')
    data = {
        'appointment': appointment.id,
        'reason': 'Reschedule'
    }
    response = api_client.post(technician_cancel_url, data)
    assert response.status_code == 201
    assert TechnicianCancellationRequest.objects.filter(appointment=appointment).exists()

@pytest.mark.django_db
def test_complete_doctor_appointment(api_client, create_users, timeslot):
    appointment = DoctorAppointment.objects.create(
        patient=create_users['patient'],
        doctor=create_users['doctor'],
        date=date.today(),
        time_slot=timeslot,
        purpose="Test",
        notes="Test"
    )
    api_client.force_authenticate(user=create_users['doctor_user'])
    url = reverse('complete-doctor-appointment', args=[appointment.id])  # Your url name here
    response = api_client.patch(url)
    assert response.status_code == 200
    appointment.refresh_from_db()
    assert appointment.status == 'completed'
