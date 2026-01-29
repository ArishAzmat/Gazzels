from django.db import models
from apps.authentication.models import User
import uuid


class Course(models.Model):
    """
    Course model representing training courses.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, db_index=True)
    duration_minutes = models.IntegerField()
    is_active = models.BooleanField(default=True, db_index=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='created_courses'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'courses'
        ordering = ['-created_at']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
    
    def __str__(self):
        return self.title


class Lesson(models.Model):
    """
    Lesson model representing individual lessons within a course.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='lessons'
    )
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True, null=True)
    order = models.IntegerField()
    duration_minutes = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lessons'
        unique_together = [['course', 'order']]
        ordering = ['order']
        indexes = [
            models.Index(fields=['course']),
        ]
        verbose_name = 'Lesson'
        verbose_name_plural = 'Lessons'
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"
