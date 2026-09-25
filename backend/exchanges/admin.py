from django.contrib import admin
from .models import ExchangeRequest, LearningSession, Feedback

@admin.register(ExchangeRequest)
class ExchangeRequestAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'offered_skill', 'requested_skill', 'status', 'created_at')
    search_fields = ('sender__full_name', 'receiver__full_name')
    list_filter = ('status',)

@admin.register(LearningSession)
class LearningSessionAdmin(admin.ModelAdmin):
    list_display = ('topic', 'scheduled_datetime', 'status', 'exchange_request')
    list_filter = ('status', 'scheduled_datetime')
    search_fields = ('topic',)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'reviewee', 'session', 'rating')
    list_filter = ('rating',)
    search_fields = ('reviewer__full_name', 'reviewee__full_name')
