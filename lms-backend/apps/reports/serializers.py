from rest_framework import serializers
from apps.assignments.models import TrainingAssignment
from apps.authentication.models import User


class PendingTrainingSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name')
    course_title = serializers.CharField(source='course.title')
    
    class Meta:
        model = TrainingAssignment
        fields = ['id', 'employee_name', 'course_title', 'assigned_date', 'due_date', 'status']


class OverdueTrainingSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.name')
    course_title = serializers.CharField(source='course.title')
    days_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = TrainingAssignment
        fields = ['id', 'employee_name', 'course_title', 'due_date', 'days_overdue', 'status']
    
    def get_days_overdue(self, obj):
        from django.utils import timezone
        delta = timezone.now().date() - obj.due_date
        return delta.days


class DepartmentSummarySerializer(serializers.Serializer):
    department = serializers.CharField()
    total_employees = serializers.IntegerField()
    total_assignments = serializers.IntegerField()
    completed_assignments = serializers.IntegerField()
    pending_assignments = serializers.IntegerField()
    overdue_assignments = serializers.IntegerField()
