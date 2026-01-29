from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.utils import timezone
from .models import TrainingAssignment
from .serializers import TrainingAssignmentSerializer, BulkAssignmentSerializer
from apps.authentication.permissions import IsAdmin, IsAdminOrOwner
from apps.courses.models import Course, Lesson
from apps.authentication.models import User
from apps.progress.models import LessonProgress


class TrainingAssignmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing training assignments.
    Admin can assign courses and view all assignments.
    Employees can view their own assignments.
    """
    queryset = TrainingAssignment.objects.all()
    serializer_class = TrainingAssignmentSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'course', 'employee']
    ordering_fields = ['due_date', 'assigned_date', 'status']
    ordering = ['due_date']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return TrainingAssignment.objects.all()
        return TrainingAssignment.objects.filter(employee=user)

    @extend_schema(
        request=BulkAssignmentSerializer,
        responses={201: TrainingAssignmentSerializer(many=True)},
        description='Bulk assign a course to multiple employees'
    )
    def create(self, request, *args, **kwargs):
        serializer = BulkAssignmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        course_id = serializer.validated_data['course_id']
        employee_ids = serializer.validated_data['employee_ids']
        due_date = serializer.validated_data['due_date']
        
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'detail': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        
        created_assignments = []
        errors = []
        
        for emp_id in employee_ids:
            try:
                employee = User.objects.get(id=emp_id)
                
                # Check if assignment already exists
                if TrainingAssignment.objects.filter(course=course, employee=employee).exists():
                    errors.append(f"Assignment already exists for employee {employee.name}")
                    continue
                
                assignment = TrainingAssignment.objects.create(
                    course=course,
                    employee=employee,
                    assigned_by=request.user,
                    assigned_date=timezone.now().date(),
                    due_date=due_date,
                    status='Pending'
                )
                
                # Initialize lesson progress records
                lessons = Lesson.objects.filter(course=course)
                for lesson in lessons:
                    LessonProgress.objects.create(
                        assignment=assignment,
                        lesson=lesson,
                        employee=employee
                    )
                
                created_assignments.append(assignment)
                
            except User.DoesNotExist:
                errors.append(f"Employee with ID {emp_id} not found")
        
        response_serializer = TrainingAssignmentSerializer(created_assignments, many=True)
        
        return Response({
            'created': response_serializer.data,
            'errors': errors
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def my_assignments(self, request):
        """
        Get assignments for the current user.
        """
        assignments = self.get_queryset().filter(employee=request.user)
        page = self.paginate_queryset(assignments)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)
