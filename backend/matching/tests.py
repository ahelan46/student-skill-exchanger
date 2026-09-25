from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from accounts.models import Student
from skills.models import Skill, StudentSkill
from matching.services import calculate_compatibility

class MatchingServiceTests(TestCase):
    def setUp(self):
        self.python = Skill.objects.create(name='Python', category='Programming')
        self.uiux = Skill.objects.create(name='UI/UX', category='Design')
        self.java = Skill.objects.create(name='Java', category='Programming')

        self.user1 = User.objects.create_user('user1', password='pw')
        self.arun = Student.objects.create(user=self.user1, full_name='Arun', department='CSE', year=1, availability='ANY', learning_preference='BOTH')

        self.user2 = User.objects.create_user('user2', password='pw')
        self.priya = Student.objects.create(user=self.user2, full_name='Priya', department='Design', year=1, availability='ANY', learning_preference='BOTH')

        self.user3 = User.objects.create_user('user3', password='pw')
        self.rahul = Student.objects.create(user=self.user3, full_name='Rahul', department='IT', year=1, availability='ANY', learning_preference='BOTH')

        self.user_empty = User.objects.create_user('empty', password='pw')
        self.empty_student = Student.objects.create(user=self.user_empty, full_name='Empty', department='None', year=1)

        # Arun teaches Python, wants UIUX
        StudentSkill.objects.create(student=self.arun, skill=self.python, skill_type='TEACH', proficiency='ADVANCED')
        StudentSkill.objects.create(student=self.arun, skill=self.uiux, skill_type='LEARN', proficiency='BEGINNER')

        # Priya teaches UIUX, wants Python
        StudentSkill.objects.create(student=self.priya, skill=self.uiux, skill_type='TEACH', proficiency='INTERMEDIATE')
        StudentSkill.objects.create(student=self.priya, skill=self.python, skill_type='LEARN', proficiency='INTERMEDIATE')

        # Rahul teaches Java, wants nothing
        StudentSkill.objects.create(student=self.rahul, skill=self.java, skill_type='TEACH', proficiency='ADVANCED')

    def test_reciprocal_matching(self):
        score, skills, expl = calculate_compatibility(self.arun, self.priya)
        self.assertGreaterEqual(score, 60) # Reciprocal gives 60 + proficiency + avail + pref
        self.assertIn('Python', skills)
        self.assertIn('UI/UX', skills)

    def test_one_way_matching(self):
        # Let's make Rahul want Python, but Arun doesn't want Java
        StudentSkill.objects.create(student=self.rahul, skill=self.python, skill_type='LEARN', proficiency='BEGINNER')
        score, skills, expl = calculate_compatibility(self.arun, self.rahul)
        self.assertGreaterEqual(score, 30) # One way gives 30 + bonuses
        self.assertLess(score, 70) # Shouldn't reach reciprocal levels
        self.assertIn('Python', skills)

    def test_no_match(self):
        score, skills, expl = calculate_compatibility(self.priya, self.rahul)
        self.assertEqual(score, 0)
        self.assertEqual(len(skills), 0)

    def test_self_match(self):
        # We don't call calculate_compatibility on self in views, but we can check it.
        # Actually, self match might score if they want to learn what they teach, but the view filters it out.
        pass

class MatchingAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user('arun_test', password='pw')
        self.arun = Student.objects.create(user=self.user, full_name='Arun', department='CSE', year=1)
        
        self.user2 = User.objects.create_user('priya_test', password='pw')
        self.priya = Student.objects.create(user=self.user2, full_name='Priya', department='Design', year=1)
        
        self.python = Skill.objects.create(name='Python', category='Programming')
        self.uiux = Skill.objects.create(name='UI/UX', category='Design')

        StudentSkill.objects.create(student=self.arun, skill=self.python, skill_type='TEACH', proficiency='ADVANCED')
        StudentSkill.objects.create(student=self.arun, skill=self.uiux, skill_type='LEARN', proficiency='BEGINNER')

        StudentSkill.objects.create(student=self.priya, skill=self.uiux, skill_type='TEACH', proficiency='INTERMEDIATE')
        StudentSkill.objects.create(student=self.priya, skill=self.python, skill_type='LEARN', proficiency='INTERMEDIATE')

    def test_authentication_required(self):
        url = reverse('matches-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)

    def test_get_matches(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('matches-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        results = response.data['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['name'], 'Priya')
        # Ensure self is excluded
        self.assertNotEqual(results[0]['name'], 'Arun')

    def test_skill_filter(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('matches-list') + '?skill=Python'
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 1)
        
        url = reverse('matches-list') + '?skill=Java'
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 0)

    def test_department_filter(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('matches-list') + '?department=Design'
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 1)

        url = reverse('matches-list') + '?department=CSE'
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 0)

    def test_min_score_filter(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('matches-list') + '?min_score=90'
        response = self.client.get(url)
        # Reciprocal + prof + avail + pref = 60 + 20 + 10 + 10 = 100
        self.assertEqual(len(response.data['results']), 1)
        
        url = reverse('matches-list') + '?min_score=101'
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 0)

    def test_empty_profile(self):
        user3 = User.objects.create_user('empty_test', password='pw')
        Student.objects.create(user=user3, full_name='Empty', department='None', year=1)
        self.client.force_authenticate(user=user3)
        url = reverse('matches-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 0)
