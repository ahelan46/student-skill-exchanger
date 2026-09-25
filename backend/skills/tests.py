from django.test import TestCase
from django.contrib.auth.models import User
from accounts.models import Student
from .models import Skill, StudentSkill

class SkillModelTest(TestCase):
    def setUp(self):
        self.skill = Skill.objects.create(name='Python', category='Programming')
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.student = Student.objects.create(
            user=self.user,
            full_name='Test Student',
            department='Computer Science',
            year=3,
        )
        self.student_skill = StudentSkill.objects.create(
            student=self.student,
            skill=self.skill,
            skill_type='TEACH',
            proficiency='ADVANCED'
        )

    def test_skill_creation(self):
        self.assertEqual(self.skill.name, 'Python')

    def test_student_skill_creation(self):
        self.assertEqual(self.student_skill.skill_type, 'TEACH')
        self.assertEqual(self.student_skill.student.full_name, 'Test Student')
