from django.contrib import admin
from .models import LessonProgress


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ['employee', 'lesson', 'assignment', 'is_completed', 'completed_at']
    list_filter = ['is_completed', 'completed_at']
    search_fields = ['employee__name', 'lesson__title', 'assignment__course__title']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
