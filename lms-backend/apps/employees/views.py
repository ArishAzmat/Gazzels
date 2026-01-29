from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter
from apps.authentication.models import User
from apps.authentication.permissions import IsAdmin, IsAdminOrOwner
from .serializers import EmployeeSerializer, EmployeeCreateSerializer, EmployeeUpdateSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing employees.
    Admin can perform all operations.
    Employees can only view their own profile.
    """
    queryset = User.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'role', 'is_active']
    search_fields = ['name', 'employee_code', 'email', 'department']
    ordering_fields = ['employee_code', 'name', 'department', 'created_at']
    ordering = ['employee_code']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return EmployeeCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return EmployeeUpdateSerializer
        return EmployeeSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'create', 'destroy']:
            permission_classes = [IsAdmin]
        else:
            permission_classes = [IsAdminOrOwner]
        return [permission() for permission in permission_classes]
    
    @extend_schema(
        description='List all employees with filtering and search',
        parameters=[
            OpenApiParameter('department', str, description='Filter by department'),
            OpenApiParameter('role', str, description='Filter by role'),
            OpenApiParameter('is_active', bool, description='Filter by active status'),
            OpenApiParameter('search', str, description='Search by name, code, email, or department'),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @extend_schema(description='Create a new employee')
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    @extend_schema(description='Retrieve employee details')
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(description='Update employee details')
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @extend_schema(description='Partially update employee details')
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @extend_schema(description='Soft delete employee (set is_active=False)')
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'detail': 'Employee deactivated successfully'}, status=status.HTTP_200_OK)
