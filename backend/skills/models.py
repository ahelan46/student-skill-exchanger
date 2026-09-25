from django.db import models
from accounts.models import Student

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class StudentSkill(models.Model):
    TYPE_CHOICES = (
        ('TEACH', 'Teach'),
        ('LEARN', 'Learn'),
    )
    PROFICIENCY_CHOICES = (
        ('BEGINNER', 'Beginner'),
        ('INTERMEDIATE', 'Intermediate'),
        ('ADVANCED', 'Advanced'),
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='student_skills')
    skill_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    proficiency = models.CharField(max_length=15, choices=PROFICIENCY_CHOICES)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ('student', 'skill', 'skill_type')

    def __str__(self):
        return f"{self.student.full_name} - {self.skill_type} {self.skill.name}"
