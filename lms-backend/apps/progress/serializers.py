from rest_framework import serializers
from .models import LessonProgress
from apps.courses.serializers import LessonSerializer
from apps.assignments.serializers import TrainingAssignmentSerializer


class LessonProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for LessonProgress model.
    """
    lesson = LessonSerializer(read_only=True)
    assignment = TrainingAssignmentSerializer(read_only=True)

    class Meta:
        model = LessonProgress
        fields = [
            'id', 'assignment', 'lesson', 'is_completed',
            'completed_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MarkLessonCompleteSerializer(serializers.Serializer):
    """
    Serializer for marking a lesson as complete.
    """
    assignment_id = serializers.UUIDField()
    lesson_id = serializers.UUIDField()
    
    def validate(self, attrs):
        # Validation logic will be in the view
        return attrs
