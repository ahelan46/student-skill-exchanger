from django.test import TestCase
from django.contrib.auth.models import User
from .models import Student

class StudentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.student = Student.objects.create(
            user=self.user,
            full_name='Test Student',
            department='Computer Science',
            year=3,
        )

    def test_student_creation(self):
        self.assertEqual(self.student.full_name, 'Test Student')
        self.assertEqual(self.student.user.username, 'testuser')
        self.assertEqual(str(self.student), 'Test Student')
