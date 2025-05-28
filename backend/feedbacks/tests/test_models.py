import pytest
from django.utils import timezone
from users.models import CustomUser
from feedbacks.models import Feedback, FeedbackResponse

@pytest.mark.django_db
class TestFeedbackModel:

    def test_create_feedback(self):
        user = CustomUser.objects.create_user(email='testuser@example.com', password='password', role='patient')
        feedback = Feedback.objects.create(
            user=user,
            category='Doctor Service',
            description='Great service',
            is_clinic_feedback=True
        )
        assert feedback.id is not None
        assert feedback.status == 'Pending'  # default status
        assert feedback.category == 'Doctor Service'
        assert feedback.is_clinic_feedback is True
        assert feedback.description == 'Great service'
        assert feedback.user == user
        assert isinstance(feedback.date_submitted, timezone.datetime)
        assert str(feedback) == f"{user.email} - {feedback.category}"

    def test_feedback_category_choices(self):
        categories = [choice[0] for choice in Feedback.CATEGORY_CHOICES]
        user = CustomUser.objects.create_user(email='user2@example.com', password='pass', role='patient')
        for category in categories:
            feedback = Feedback.objects.create(
                user=user,
                category=category,
                description='Test',
                is_clinic_feedback=False
            )
            assert feedback.category in categories

    def test_status_choices(self):
        user = CustomUser.objects.create_user(email='user3@example.com', password='pass', role='patient')
        feedback = Feedback.objects.create(
            user=user,
            category='Technical Issue',
            description='Test',
            is_clinic_feedback=True,
            status='Resolved'
        )
        assert feedback.status == 'Resolved'

@pytest.mark.django_db
class TestFeedbackResponseModel:

    def test_create_feedback_response(self):
        user = CustomUser.objects.create_user(email='admin@example.com', password='pass', role='clinic_admin')
        patient = CustomUser.objects.create_user(email='patient@example.com', password='pass', role='patient')
        feedback = Feedback.objects.create(
            user=patient,
            category='Doctor Service',
            description='Needs improvement',
            is_clinic_feedback=True
        )

        response = FeedbackResponse.objects.create(
            feedback=feedback,
            admin=user,
            description='We will look into this'
        )
        assert response.id is not None
        assert response.feedback == feedback
        assert response.admin == user
        assert response.description == 'We will look into this'
        assert isinstance(response.date_submitted, timezone.datetime)
        assert str(response) == f"Response to {patient.email}"

    def test_one_to_one_feedback_response(self):
        user = CustomUser.objects.create_user(email='admin2@example.com', password='pass', role='lab_admin')
        patient = CustomUser.objects.create_user(email='patient2@example.com', password='pass', role='patient')
        feedback = Feedback.objects.create(
            user=patient,
            category='Lab Test Accuracy',
            description='Lab test was inaccurate',
            is_clinic_feedback=False
        )
        response1 = FeedbackResponse.objects.create(
            feedback=feedback,
            admin=user,
            description='First response'
        )

        with pytest.raises(Exception):  # Should raise IntegrityError or similar due to one-to-one constraint
            FeedbackResponse.objects.create(
                feedback=feedback,
                admin=user,
                description='Second response'
            )
