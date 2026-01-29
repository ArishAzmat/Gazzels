from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import Course, Lesson
from .serializers import CourseSerializer, CourseCreateSerializer, LessonSerializer
from apps.authentication.permissions import IsAdmin, IsAdminOrReadOnly, IsAdmin


class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing courses.
    Admin can perform all operations.
    Authenticated users can view active courses.
    """
    queryset = Course.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['title', 'description', 'category']
    ordering_fields = ['title', 'created_at', 'duration_minutes']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        # If not admin, only show active courses
        if not self.request.user.is_staff and getattr(self.request.user, 'role', '') != 'Admin':
            return queryset.filter(is_active=True)
        return queryset

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CourseCreateSerializer
        return CourseSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @extend_schema(description='Soft delete course (set is_active=False)')
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'detail': 'Course deactivated successfully'}, status=status.HTTP_200_OK)


class LessonViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing lessons.
    Only Admin can manage lessons.
    """
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['course']
    ordering_fields = ['order']
    ordering = ['order']

    def get_queryset(self):
        return Lesson.objects.all()
