from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrainingAssignmentViewSet

router = DefaultRouter()
router.register(r'', TrainingAssignmentViewSet, basename='assignment')

urlpatterns = [
    path('', include(router.urls)),
]
