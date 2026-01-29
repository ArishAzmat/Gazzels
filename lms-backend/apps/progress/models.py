from django.db import models
from apps.authentication.models import User
from apps.assignments.models import TrainingAssignment
from apps.courses.models import Lesson
import uuid


class LessonProgress(models.Model):
    """
    LessonProgress model tracking individual lesson completion.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assignment = models.ForeignKey(
        TrainingAssignment,
        on_delete=models.CASCADE,
        related_name='lesson_progress'
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='progress_records'
    )
    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='lesson_progress'
    )
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lesson_progress'
        unique_together = [['assignment', 'lesson', 'employee']]
        ordering = ['lesson__order']
        indexes = [
            models.Index(fields=['assignment']),
            models.Index(fields=['employee']),
        ]
        verbose_name = 'Lesson Progress'
        verbose_name_plural = 'Lesson Progress'
    
    def __str__(self):
        return f"{self.employee.name} - {self.lesson.title} - {'✓' if self.is_completed else '✗'}"
