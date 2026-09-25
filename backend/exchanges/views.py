from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.db.models import Q
from django.utils import timezone
from .models import ExchangeRequest, LearningSession, Feedback
from .serializers import (
    ExchangeRequestSerializer, 
    ExchangeRequestUpdateSerializer,
    LearningSessionSerializer,
    FeedbackSerializer
)

class ExchangeRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ExchangeRequestUpdateSerializer
        return ExchangeRequestSerializer

    def get_queryset(self):
        student = self.request.user.student_profile
        return ExchangeRequest.objects.filter(Q(sender=student) | Q(receiver=student)).order_by('-created_at')

    def perform_create(self, serializer):
        sender = self.request.user.student_profile
        receiver = serializer.validated_data['receiver']
        offered_skill = serializer.validated_data['offered_skill']
        requested_skill = serializer.validated_data['requested_skill']

        if sender == receiver:
            raise ValidationError("Users cannot send exchange requests to themselves.")

        # Check ownership
        if not sender.skills.filter(skill=offered_skill, skill_type='TEACH').exists():
            raise ValidationError("You do not teach the offered skill.")
        
        if not receiver.skills.filter(skill=requested_skill, skill_type='TEACH').exists():
            raise ValidationError("The receiver does not teach the requested skill.")

        # Check duplicates
        if ExchangeRequest.objects.filter(
            sender=sender, receiver=receiver, 
            offered_skill=offered_skill, requested_skill=requested_skill, 
            status='PENDING'
        ).exists():
            raise ValidationError("A pending request for these skills already exists.")

        serializer.save(sender=sender, status='PENDING')

    def perform_update(self, serializer):
        req = self.get_object()
        student = self.request.user.student_profile
        new_status = serializer.validated_data.get('status', req.status)

        if new_status in ['ACCEPTED', 'REJECTED']:
            if req.receiver != student:
                raise PermissionDenied("Only the receiver can accept or reject.")
            if req.status != 'PENDING':
                raise ValidationError("Can only accept or reject pending requests.")
        
        elif new_status == 'CANCELLED':
            if req.sender != student:
                raise PermissionDenied("Only the sender can cancel.")
            if req.status != 'PENDING':
                raise ValidationError("Can only cancel pending requests.")
        
        serializer.save()

class LearningSessionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LearningSessionSerializer

    def get_queryset(self):
        student = self.request.user.student_profile
        return LearningSession.objects.filter(
            Q(exchange_request__sender=student) | Q(exchange_request__receiver=student)
        ).order_by('scheduled_datetime')

    def perform_create(self, serializer):
        student = self.request.user.student_profile
        er = serializer.validated_data['exchange_request']

        if student not in [er.sender, er.receiver]:
            raise PermissionDenied("You are not part of this exchange request.")
        
        if er.status != 'ACCEPTED':
            raise ValidationError("Sessions can only be created for accepted exchange requests.")

        if hasattr(er, 'session') and er.session is not None:
            raise ValidationError("A session already exists for this exchange request.")

        # date validation could be added here
        if serializer.validated_data['scheduled_datetime'] < timezone.now():
            raise ValidationError("Cannot schedule a session in the past.")

        serializer.save(status='SCHEDULED')

    def perform_update(self, serializer):
        session = self.get_object()
        student = self.request.user.student_profile
        if student not in [session.exchange_request.sender, session.exchange_request.receiver]:
            raise PermissionDenied("You are not part of this session.")
        
        serializer.save()

class FeedbackViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        student = self.request.user.student_profile
        return Feedback.objects.filter(Q(reviewer=student) | Q(reviewee=student))

    def perform_create(self, serializer):
        reviewer = self.request.user.student_profile
        session = serializer.validated_data['session']
        reviewee = serializer.validated_data['reviewee']

        if session.status != 'COMPLETED':
            raise ValidationError("Can only provide feedback for completed sessions.")

        if reviewer not in [session.exchange_request.sender, session.exchange_request.receiver]:
            raise PermissionDenied("You are not part of this session.")
        
        if reviewee not in [session.exchange_request.sender, session.exchange_request.receiver]:
            raise ValidationError("Reviewee is not part of this session.")

        if reviewer == reviewee:
            raise ValidationError("You cannot review yourself.")

        if Feedback.objects.filter(session=session, reviewer=reviewer).exists():
            raise ValidationError("You have already provided feedback for this session.")

        serializer.save(reviewer=reviewer)
