from rest_framework import serializers
from .models import Course, Lesson


class LessonSerializer(serializers.ModelSerializer):
    """
    Serializer for Lesson model.
    """
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'order', 'duration_minutes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CourseSerializer(serializers.ModelSerializer):
    """
    Serializer for Course model (read operations).
    Includes nested lessons.
    """
    lessons = LessonSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'category', 'duration_minutes',
            'is_active', 'created_by', 'created_by_name', 'created_at',
            'updated_at', 'lessons'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class CourseCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating courses with optional nested lessons.
    """
    lessons = LessonSerializer(many=True, required=False)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'category', 'duration_minutes',
            'is_active', 'lessons'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        lessons_data = validated_data.pop('lessons', [])
        course = Course.objects.create(**validated_data)
        
        for lesson_data in lessons_data:
            Lesson.objects.create(course=course, **lesson_data)
            
        return course

    def update(self, instance, validated_data):
        # We don't update lessons here to avoid complexity
        # Lessons should be managed via the LessonViewSet
        lessons_data = validated_data.pop('lessons', None)
        return super().update(instance, validated_data)
