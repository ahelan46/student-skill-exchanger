from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'department', 'year', 'created_at')
    search_fields = ('full_name', 'department', 'user__username')
    list_filter = ('department', 'year')
