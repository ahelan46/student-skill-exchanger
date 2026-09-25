from rest_framework import viewsets
from .models import Skill, StudentSkill
from .serializers import SkillSerializer, StudentSkillSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class StudentSkillViewSet(viewsets.ModelViewSet):
    queryset = StudentSkill.objects.all()
    serializer_class = StudentSkillSerializer
