from django.db import models
from django.core.exceptions import ValidationError
from accounts.models import Student
from skills.models import Skill

class ExchangeRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    )

    sender = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='received_requests')
    offered_skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='offered_in_requests')
    requested_skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='requested_in_requests')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.sender == self.receiver:
            raise ValidationError("Users cannot send exchange requests to themselves.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.sender.full_name} -> {self.receiver.full_name} ({self.status})"

class LearningSession(models.Model):
    STATUS_CHOICES = (
        ('SCHEDULED', 'Scheduled'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    exchange_request = models.OneToOneField(ExchangeRequest, on_delete=models.CASCADE, related_name='session')
    topic = models.CharField(max_length=255)
    scheduled_datetime = models.DateTimeField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='SCHEDULED')
    completion_details = models.TextField(blank=True)

    def __str__(self):
        return f"Session: {self.topic} on {self.scheduled_datetime}"

class Feedback(models.Model):
    session = models.ForeignKey(LearningSession, on_delete=models.CASCADE, related_name='feedbacks')
    reviewer = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='given_feedbacks')
    reviewee = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='received_feedbacks')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()

    class Meta:
        unique_together = ('session', 'reviewer')

    def __str__(self):
        return f"Feedback from {self.reviewer.full_name} for {self.session.topic}"
