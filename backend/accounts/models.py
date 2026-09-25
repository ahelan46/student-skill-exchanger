from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    full_name = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    year = models.IntegerField(help_text="Year of study (e.g. 1, 2, 3, 4)")
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    
    AVAILABILITY_CHOICES = (
        ('WEEKDAYS', 'Weekdays'),
        ('WEEKENDS', 'Weekends'),
        ('ANY', 'Any'),
    )
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='ANY')

    PREFERENCE_CHOICES = (
        ('ONLINE', 'Online'),
        ('IN_PERSON', 'In-Person'),
        ('BOTH', 'Both'),
    )
    learning_preference = models.CharField(max_length=20, choices=PREFERENCE_CHOICES, default='BOTH')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name

