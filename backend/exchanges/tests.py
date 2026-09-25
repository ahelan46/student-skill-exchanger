from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from accounts.models import Student
from skills.models import Skill, StudentSkill
from exchanges.models import ExchangeRequest, LearningSession, Feedback
from django.utils import timezone
from datetime import timedelta

class ExchangeAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user('user1', password='pw')
        self.student1 = Student.objects.create(user=self.user1, full_name='Arun', department='CSE', year=1)
        
        self.user2 = User.objects.create_user('user2', password='pw')
        self.student2 = Student.objects.create(user=self.user2, full_name='Priya', department='Design', year=1)
        
        self.python = Skill.objects.create(name='Python', category='Programming')
        self.uiux = Skill.objects.create(name='UI/UX', category='Design')

        self.ss1 = StudentSkill.objects.create(student=self.student1, skill=self.python, skill_type='TEACH', proficiency='ADVANCED')
        self.ss2 = StudentSkill.objects.create(student=self.student2, skill=self.uiux, skill_type='TEACH', proficiency='INTERMEDIATE')

    def test_request_creation_and_duplicates(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('requests-list')
        data = {
            'receiver': self.student2.id,
            'offered_skill': self.python.id,
            'requested_skill': self.uiux.id
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, 201)
        
        # Test duplicate pending request
        res2 = self.client.post(url, data)
        self.assertEqual(res2.status_code, 400)
        self.assertIn("A pending request for these skills already exists", str(res2.data))

    def test_request_permissions_and_cancellation(self):
        req = ExchangeRequest.objects.create(
            sender=self.student1, receiver=self.student2,
            offered_skill=self.python, requested_skill=self.uiux
        )
        url = reverse('requests-detail', args=[req.id])
        
        # Sender tries to accept (should fail)
        self.client.force_authenticate(user=self.user1)
        res = self.client.patch(url, {'status': 'ACCEPTED'})
        self.assertEqual(res.status_code, 403)
        
        # Receiver accepts
        self.client.force_authenticate(user=self.user2)
        res = self.client.patch(url, {'status': 'ACCEPTED'})
        self.assertEqual(res.status_code, 200)

        # Receiver cancels (should fail)
        req.status = 'PENDING'
        req.save()
        res = self.client.patch(url, {'status': 'CANCELLED'})
        self.assertEqual(res.status_code, 403)

        # Sender cancels
        self.client.force_authenticate(user=self.user1)
        res = self.client.patch(url, {'status': 'CANCELLED'})
        self.assertEqual(res.status_code, 200)

    def test_session_creation_and_completion(self):
        req = ExchangeRequest.objects.create(
            sender=self.student1, receiver=self.student2,
            offered_skill=self.python, requested_skill=self.uiux, status='ACCEPTED'
        )
        self.client.force_authenticate(user=self.user1)
        url = reverse('sessions-list')
        data = {
            'exchange_request': req.id,
            'topic': 'Intro to UI/UX',
            'scheduled_datetime': timezone.now() + timedelta(days=1)
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, 201)
        session_id = res.data['id']

        # Complete session
        url_detail = reverse('sessions-detail', args=[session_id])
        res = self.client.patch(url_detail, {'status': 'COMPLETED'})
        self.assertEqual(res.status_code, 200)

    def test_feedback_validation_and_duplicates(self):
        req = ExchangeRequest.objects.create(
            sender=self.student1, receiver=self.student2,
            offered_skill=self.python, requested_skill=self.uiux, status='ACCEPTED'
        )
        session = LearningSession.objects.create(
            exchange_request=req, topic='Topic', scheduled_datetime=timezone.now(), status='COMPLETED'
        )
        self.client.force_authenticate(user=self.user1)
        url = reverse('feedback-list')
        data = {
            'session': session.id,
            'reviewee': self.student1.id, # self review should fail
            'rating': 5,
            'comment': 'Great'
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, 400)
        self.assertIn("You cannot review yourself", str(res.data))

        # Valid feedback
        data['reviewee'] = self.student2.id
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, 201)

        # Duplicate feedback
        res2 = self.client.post(url, data)
        self.assertEqual(res2.status_code, 400)
        self.assertIn("already provided feedback", str(res2.data))
