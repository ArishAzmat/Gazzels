from django.contrib import admin
from .models import TrainingAssignment


@admin.register(TrainingAssignment)
class TrainingAssignmentAdmin(admin.ModelAdmin):
    list_display = ['employee', 'course', 'assigned_date', 'due_date', 'status', 'assigned_by']
    list_filter = ['status', 'assigned_date', 'due_date']
    search_fields = ['employee__name', 'employee__employee_code', 'course__title']
    readonly_fields = ['created_at', 'updated_at', 'started_at', 'completed_at']
    date_hierarchy = 'assigned_date'
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating a new object
            obj.assigned_by = request.user
        super().save_model(request, obj, form, change)
