from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExchangeRequestViewSet, LearningSessionViewSet, FeedbackViewSet

router = DefaultRouter()
router.register(r'requests', ExchangeRequestViewSet, basename='requests')
router.register(r'sessions', LearningSessionViewSet, basename='sessions')
router.register(r'feedback', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', include(router.urls)),
]
