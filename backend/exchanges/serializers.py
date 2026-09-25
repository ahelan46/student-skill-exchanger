from rest_framework import serializers
from .models import ExchangeRequest, LearningSession, Feedback
from accounts.serializers import StudentSerializer
from skills.serializers import SkillSerializer

class ExchangeRequestSerializer(serializers.ModelSerializer):
    sender_detail = StudentSerializer(source='sender', read_only=True)
    receiver_detail = StudentSerializer(source='receiver', read_only=True)
    offered_skill_detail = SkillSerializer(source='offered_skill', read_only=True)
    requested_skill_detail = SkillSerializer(source='requested_skill', read_only=True)

    class Meta:
        model = ExchangeRequest
        fields = '__all__'
        read_only_fields = ('sender', 'status')

class ExchangeRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRequest
        fields = ('status',)

class LearningSessionSerializer(serializers.ModelSerializer):
    exchange_request_detail = ExchangeRequestSerializer(source='exchange_request', read_only=True)

    class Meta:
        model = LearningSession
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    reviewer_detail = StudentSerializer(source='reviewer', read_only=True)
    reviewee_detail = StudentSerializer(source='reviewee', read_only=True)

    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ('reviewer',)
