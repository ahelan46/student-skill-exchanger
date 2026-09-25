from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import Student
from skills.models import Skill, StudentSkill

class Command(BaseCommand):
    help = 'Seed database with demo data for matching'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding demo data...")

        # Create skills
        python_skill, _ = Skill.objects.get_or_create(name='Python', defaults={'category': 'Programming'})
        uiux_skill, _ = Skill.objects.get_or_create(name='UI/UX', defaults={'category': 'Design'})
        java_skill, _ = Skill.objects.get_or_create(name='Java', defaults={'category': 'Programming'})
        video_skill, _ = Skill.objects.get_or_create(name='Video Editing', defaults={'category': 'Media'})

        # Function to create user and student
        def create_student(username, name, dept):
            if User.objects.filter(username=username).exists():
                return Student.objects.get(user__username=username)
            user = User.objects.create_user(username=username, password='demo_password_123!')
            student = Student.objects.create(
                user=user,
                full_name=name,
                department=dept,
                year=3,
                availability='ANY',
                learning_preference='BOTH'
            )
            return student

        arun = create_student('arun_demo', 'Arun', 'CSE')
        priya = create_student('priya_demo', 'Priya', 'Design')
        rahul = create_student('rahul_demo', 'Rahul', 'IT')
        meena = create_student('meena_demo', 'Meena', 'Media Studies')

        # Clear existing skills for these demo users to avoid duplicates
        StudentSkill.objects.filter(student__in=[arun, priya, rahul, meena]).delete()

        # Arun: teaches Python, wants UI/UX
        StudentSkill.objects.create(student=arun, skill=python_skill, skill_type='TEACH', proficiency='ADVANCED')
        StudentSkill.objects.create(student=arun, skill=uiux_skill, skill_type='LEARN', proficiency='BEGINNER')

        # Priya: teaches UI/UX, wants Python
        StudentSkill.objects.create(student=priya, skill=uiux_skill, skill_type='TEACH', proficiency='INTERMEDIATE')
        StudentSkill.objects.create(student=priya, skill=python_skill, skill_type='LEARN', proficiency='INTERMEDIATE')

        # Rahul: teaches Java, wants video editing
        StudentSkill.objects.create(student=rahul, skill=java_skill, skill_type='TEACH', proficiency='ADVANCED')
        StudentSkill.objects.create(student=rahul, skill=video_skill, skill_type='LEARN', proficiency='BEGINNER')

        # Meena: teaches video editing, wants Java
        StudentSkill.objects.create(student=meena, skill=video_skill, skill_type='TEACH', proficiency='INTERMEDIATE')
        StudentSkill.objects.create(student=meena, skill=java_skill, skill_type='LEARN', proficiency='INTERMEDIATE')

        self.stdout.write(self.style.SUCCESS("Successfully seeded demo data! Demo credentials are user: arun_demo, password: demo_password_123! (Use for testing only)"))
