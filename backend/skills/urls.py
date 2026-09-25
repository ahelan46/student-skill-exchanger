from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet, StudentSkillViewSet

router = DefaultRouter()
router.register(r'skills', SkillViewSet)
router.register(r'student-skills', StudentSkillViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
