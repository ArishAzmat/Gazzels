from rest_framework import serializers
from .models import TrainingAssignment
from apps.courses.serializers import CourseSerializer
from apps.authentication.serializers import UserSerializer
from apps.progress.models import LessonProgress
from apps.courses.models import Lesson


class TrainingAssignmentSerializer(serializers.ModelSerializer):
    """
    Serializer for TrainingAssignment model.
    """
    course = CourseSerializer(read_only=True)
    employee = UserSerializer(read_only=True)
    assigned_by_name = serializers.CharField(source='assigned_by.name', read_only=True)
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = TrainingAssignment
        fields = [
            'id', 'course', 'employee', 'assigned_by_name',
            'assigned_date', 'due_date', 'status',
            'started_at', 'completed_at', 'progress_percentage',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'assigned_by', 'created_at', 'updated_at', 'status', 'started_at', 'completed_at']

    def get_progress_percentage(self, obj):
        total_lessons = obj.course.lessons.count()
        if total_lessons == 0:
            return 100 if obj.status == 'Completed' else 0
        
        completed_lessons = LessonProgress.objects.filter(
            assignment=obj,
            is_completed=True
        ).count()
        
        return round((completed_lessons / total_lessons) * 100, 2)


class BulkAssignmentSerializer(serializers.Serializer):
    """
    Serializer for bulk assigning courses to employees.
    """
    course_id = serializers.UUIDField()
    employee_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False
    )
    due_date = serializers.DateField()

    def create(self, validated_data):
        # Logic is handled in the viewset
        pass
