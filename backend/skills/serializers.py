from rest_framework import serializers
from .models import Skill, StudentSkill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class StudentSkillSerializer(serializers.ModelSerializer):
    skill_detail = SkillSerializer(source='skill', read_only=True)

    class Meta:
        model = StudentSkill
        fields = '__all__'
        
    def validate(self, data):
        # Additional validation can go here if needed
        return data
