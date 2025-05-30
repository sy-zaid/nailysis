from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from users.models import CustomUser, Patient, Doctor, ClinicAdmin, LabTechnician, LabAdmin
from feedbacks.models import Feedback, FeedbackResponse

class FeedbackViewSetTests(APITestCase):

    def setUp(self):
        # Create users for all roles
        self.patient_user = CustomUser.objects.create_user(email='patient1@example.com', password='pass', role='patient')
        self.doctor_user = CustomUser.objects.create_user(email='doctor1@example.com', password='pass', role='doctor')
        self.clinic_admin_user = CustomUser.objects.create_user(email='clinicadmin@example.com', password='pass', role='clinic_admin')
        self.lab_technician_user = CustomUser.objects.create_user(email='labtech@example.com', password='pass', role='lab_technician')
        self.lab_admin_user = CustomUser.objects.create_user(email='labadmin@example.com', password='pass', role='lab_admin')

        # Create some feedbacks
        self.clinic_feedback = Feedback.objects.create(user=self.patient_user, category="Doctor Service", description="Good service", is_clinic_feedback=True)
        self.lab_feedback = Feedback.objects.create(user=self.lab_technician_user, category="Lab Test Accuracy", description="Test was inaccurate", is_clinic_feedback=False)

    def test_get_queryset_patient_sees_own_feedback(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(reverse('feedbacks-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for fb in response.data:
            self.assertEqual(fb['user_id'], self.patient_user.user_id)

    def test_get_queryset_clinic_admin_sees_clinic_feedback_only(self):
        self.client.force_authenticate(user=self.clinic_admin_user)
        response = self.client.get(reverse('feedbacks-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for fb in response.data:
            self.assertTrue(fb['is_clinic_feedback'])

    def test_submit_feedback_unauthorized_role(self):
        self.client.force_authenticate(user=self.clinic_admin_user)
        url = reverse('feedbacks-submit-feedback')
        data = {'category': 'Doctor Service', 'description': 'Test', 'is_clinic_feedback': True}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_submit_feedback_missing_fields(self):
        self.client.force_authenticate(user=self.patient_user)
        url = reverse('feedbacks-submit-feedback')
        data = {'category': '', 'description': ''}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_submit_feedback_success(self):
        self.client.force_authenticate(user=self.patient_user)
        url = reverse('feedbacks-submit-feedback')
        data = {'category': 'Doctor Service', 'description': 'Great', 'is_clinic_feedback': True}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('feedback_id', response.data)

    def test_mark_resolved_permissions(self):
        self.client.force_authenticate(user=self.clinic_admin_user)
        url = reverse('feedbacks-mark-feedback-resolved', args=[self.lab_feedback.id])
        response = self.client.post(url)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

        self.client.force_authenticate(user=self.lab_admin_user)
        url = reverse('feedbacks-mark-feedback-resolved', args=[self.clinic_feedback.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_mark_resolved_success(self):
        self.client.force_authenticate(user=self.clinic_admin_user)
        url = reverse('feedbacks-mark-feedback-resolved', args=[self.clinic_feedback.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.clinic_feedback.refresh_from_db()
        self.assertEqual(self.clinic_feedback.status, "Resolved")

    def test_delete_feedback_permissions(self):
        self.client.force_authenticate(user=self.patient_user)
        url = reverse('feedbacks-detail', args=[self.lab_feedback.id])
        response = self.client.delete(url)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

        self.client.force_authenticate(user=self.clinic_admin_user)
        url = reverse('feedbacks-detail', args=[self.lab_feedback.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_feedback_success(self):
        self.client.force_authenticate(user=self.patient_user)
        url = reverse('feedbacks-detail', args=[self.clinic_feedback.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Feedback.objects.filter(id=self.clinic_feedback.id).exists())

    def test_fetch_categories(self):
        self.client.force_authenticate(user=self.patient_user)
        url = reverse('feedbacks-fetch-categories')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('categories', response.data)
        self.assertTrue(len(response.data['categories']) > 0)


class FeedbackResponseViewSetTests(APITestCase):

    def setUp(self):
        self.clinic_admin_user = CustomUser.objects.create_user(email='clinicadmin@example.com', password='pass', role='clinic_admin')
        self.patient_user = CustomUser.objects.create_user(email='patient1@example.com', password='pass', role='patient')
        self.feedback = Feedback.objects.create(user=self.patient_user, category="Doctor Service", description="Feedback desc", is_clinic_feedback=True)

    def test_submit_response_unauthorized_user(self):
        self.client.force_authenticate(user=self.patient_user)
        url = reverse('feedback_response-submit-response', args=[self.feedback.id])
        response = self.client.post(url, {'description': 'Response'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_submit_response_missing_description(self):
        self.client.force_authenticate(user=self.clinic_admin_user)
        url = reverse('feedback_response-submit-response', args=[self.feedback.id])
        response = self.client.post(url, {'description': ''})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_submit_response_success(self):
        self.client.force_authenticate(user=self.clinic_admin_user)
        url = reverse('feedback_response-submit-response', args=[self.feedback.id])
        data = {'description': 'Thanks for your feedback', 'status': 'Resolved'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.feedback.refresh_from_db()
        self.assertEqual(self.feedback.status, 'Resolved')
        self.assertTrue(FeedbackResponse.objects.filter(feedback=self.feedback).exists())

    def test_submit_response_already_exists(self):
        self.client.force_authenticate(user=self.clinic_admin_user)
        FeedbackResponse.objects.create(feedback=self.feedback, admin=self.clinic_admin_user, description="Already exists")
        url = reverse('feedback_response-submit-response', args=[self.feedback.id])
        response = self.client.post(url, {'description': 'Another response'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
