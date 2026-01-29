from django.contrib import admin
from .models import Course, Lesson


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ['title', 'order', 'duration_minutes', 'content']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'duration_minutes', 'is_active', 'created_by', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'category']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [LessonInline]
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating a new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'duration_minutes']
    list_filter = ['course']
    search_fields = ['title', 'content']
    ordering = ['course', 'order']
