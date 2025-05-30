import pytest
from django.utils import timezone
from users.models import Patient, CustomUser
from ehr.models import EHR
from model_service.models import NailDiseasePrediction, NailImage
import datetime

@pytest.mark.django_db
def test_nail_disease_prediction_creation():
    # Create user with email (not username)
    user = CustomUser.objects.create_user(
        email='patient1@example.com',
        password='pass123',
        role='patient',
        first_name='Patient',
        last_name='One'
    )
    patient = Patient.objects.create(user=user, date_of_birth=datetime.date(1990, 5, 29))
    ehr = EHR.objects.create(patient=patient, record='Sample record')

    prediction = NailDiseasePrediction.objects.create(
        patient=patient,
        ehr=ehr,
        predicted_class="Onychomycosis",
        confidence=0.85,
        all_predictions=[{"top_classes": [{"predicted_class": "Onychomycosis", "confidence": 0.85}]}],
        symptoms="Thickened nails",
        status="Completed",
        timestamp=timezone.now()
    )

    assert prediction.patient == patient
    assert prediction.ehr == ehr
    assert prediction.predicted_class == "Onychomycosis"
    assert prediction.confidence == 0.85
    assert prediction.status == "Completed"


@pytest.mark.django_db
def test_nail_image_creation():
    user = CustomUser.objects.create_user(
        email='patient2@example.com',
        password='pass123',
        role='patient',
        first_name='Patient',
        last_name='Two'
    )
    patient = Patient.objects.create(user=user, date_of_birth=datetime.date(1995, 6, 24))
    prediction = NailDiseasePrediction.objects.create(
        patient=patient,
        predicted_class="Healthy",
        confidence=0.95,
        all_predictions=[],
        status="Completed",
        timestamp=timezone.now()
    )

    nail_image = NailImage.objects.create(
        prediction=prediction,
        image='nail_scans/sample.jpg',  # You can mock this or use test media setup
        image_index=1
    )

    assert nail_image.prediction == prediction
    assert nail_image.image_index == 1
