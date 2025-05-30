import pytest
from datetime import time, date, datetime
from django.utils.timezone import now
from appointments.models import (
    TimeSlot, Appointment, DoctorAppointment, TechnicianAppointment,
    DoctorAppointmentFee, CancellationRequest, TechnicianCancellationRequest
)
from ehr.models import EHR
from users.models import Patient, Doctor, LabTechnician, ClinicAdmin, LabAdmin


@pytest.mark.django_db
def test_create_time_slot_with_doctor(doctor):
    slot = TimeSlot.objects.create(
        doctor=doctor,
        slot_date=date.today(),
        start_time=time(10, 0),
        end_time=time(10, 30)
    )
    assert str(slot) == f"{doctor} | {slot.slot_date} | {slot.start_time} - {slot.end_time}"


@pytest.mark.django_db
def test_appointment_mark_completed(patient, doctor, time_slot):
    appointment = DoctorAppointment.objects.create(
        patient=patient,
        doctor=doctor,
        appointment_type="Consultation",
        time_slot=time_slot,
    )
    completed = appointment.mark_completed()
    assert completed is True
    assert appointment.status == "Completed"
    assert appointment.checkin_datetime is not None
    assert appointment.checkout_datetime is not None
    assert appointment.time_slot is None


@pytest.mark.django_db
def test_appointment_cancel(patient, time_slot):
    appointment = Appointment.objects.create(patient=patient, time_slot=time_slot)
    appointment.cancel_appointment()
    assert appointment.status == "Cancelled"
    assert appointment.time_slot is None


@pytest.mark.django_db
def test_doctor_appointment_fee_auto_set(patient, doctor, time_slot):
    DoctorAppointmentFee.objects.create(appointment_type="Consultation", fee=500.0)
    appointment = DoctorAppointment.objects.create(
        patient=patient,
        doctor=doctor,
        appointment_type="Consultation",
        time_slot=time_slot
    )
    assert appointment.fee == 500.0


@pytest.mark.django_db
def test_technician_appointment_fee_calculation(patient, lab_technician, lab_test, time_slot):
    appointment = TechnicianAppointment.objects.create(
        patient=patient,
        lab_technician=lab_technician,
        time_slot=time_slot
    )
    appointment.lab_tests.set([lab_test])
    appointment.calculate_fee()
    assert appointment.fee == lab_test.price


@pytest.mark.django_db
def test_reschedule_time_slot(patient, time_slot, new_time_slot):
    appointment = Appointment.objects.create(patient=patient, time_slot=time_slot)
    success = appointment.reschedule_time_slot(new_time_slot.id)
    assert success is True
    assert appointment.time_slot == new_time_slot
    assert appointment.status == "Rescheduled"
    assert not time_slot.is_booked
    assert new_time_slot.is_booked


@pytest.mark.django_db
def test_doctor_cancellation_request_unique_constraint(doctor, patient, clinic_admin, time_slot):
    appointment = DoctorAppointment.objects.create(
        patient=patient, doctor=doctor, appointment_type="Consultation", time_slot=time_slot
    )
    CancellationRequest.objects.create(doctor=doctor, appointment=appointment, reviewed_by=clinic_admin, reason="Reason A")
    with pytest.raises(Exception):
        # Violates unique constraint
        CancellationRequest.objects.create(doctor=doctor, appointment=appointment, reviewed_by=clinic_admin, reason="Reason B")


@pytest.mark.django_db
def test_technician_cancellation_request_unique_constraint(lab_technician, patient, lab_admin, time_slot):
    appointment = TechnicianAppointment.objects.create(
        patient=patient, lab_technician=lab_technician, time_slot=time_slot
    )
    TechnicianCancellationRequest.objects.create(
        lab_technician=lab_technician, appointment=appointment, reviewed_by=lab_admin, reason="Tech Reason A"
    )
    with pytest.raises(Exception):
        TechnicianCancellationRequest.objects.create(
            lab_technician=lab_technician, appointment=appointment, reviewed_by=lab_admin, reason="Tech Reason B"
        )
