from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, LessonViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'', CourseViewSet, basename='course')

urlpatterns = [
    path('', include(router.urls)),
]
