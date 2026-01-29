from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.utils import timezone
from .serializers import PendingTrainingSerializer, OverdueTrainingSerializer, DepartmentSummarySerializer
from apps.assignments.models import TrainingAssignment
from apps.authentication.models import User
from apps.authentication.permissions import IsAdmin


class ReportViewSet(viewsets.ViewSet):
    """
    ViewSet for generating reports.
    Admin only.
    """
    permission_classes = [IsAdmin]

    @action(detail=False, methods=['get'])
    def pending_trainings(self, request):
        queryset = TrainingAssignment.objects.filter(status='Pending')
        serializer = PendingTrainingSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def overdue_trainings(self, request):
        queryset = TrainingAssignment.objects.filter(
            due_date__lt=timezone.now().date()
        ).exclude(status='Completed')
        serializer = OverdueTrainingSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def department_summary(self, request):
        departments = User.objects.values('department').annotate(
            total_employees=Count('id', distinct=True),
            total_assignments=Count('assignments_received', distinct=True),
            completed_assignments=Count('assignments_received', filter=Q(assignments_received__status='Completed'), distinct=True),
            pending_assignments=Count('assignments_received', filter=Q(assignments_received__status='Pending'), distinct=True),
            overdue_assignments=Count('assignments_received', filter=Q(assignments_received__status='Overdue'), distinct=True)
        )
        serializer = DepartmentSummarySerializer(departments, many=True)
        return Response(serializer.data)
