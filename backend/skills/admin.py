from django.contrib import admin
from .models import Skill, StudentSkill

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    search_fields = ('name', 'category')
    list_filter = ('category',)

@admin.register(StudentSkill)
class StudentSkillAdmin(admin.ModelAdmin):
    list_display = ('student', 'skill', 'skill_type', 'proficiency')
    search_fields = ('student__full_name', 'skill__name')
    list_filter = ('skill_type', 'proficiency')
