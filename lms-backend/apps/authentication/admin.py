from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['employee_code', 'email', 'name', 'department', 'role', 'is_active']
    list_filter = ['role', 'department', 'is_active']
    search_fields = ['employee_code', 'email', 'name', 'department']
    ordering = ['employee_code']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('employee_code', 'name', 'department')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'employee_code', 'name', 'department', 'role', 'password1', 'password2'),
        }),
    )
