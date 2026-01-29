from django.db import models
from apps.authentication.models import User
from apps.courses.models import Course
import uuid
from datetime import date


class TrainingAssignment(models.Model):
    """
    TrainingAssignment model representing course assignments to employees.
    """
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('InProgress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Overdue', 'Overdue'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='assignments_received'
    )
    assigned_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='assignments_given'
    )
    assigned_date = models.DateField()
    due_date = models.DateField(db_index=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending',
        db_index=True
    )
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'training_assignments'
        unique_together = [['course', 'employee']]
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['employee']),
            models.Index(fields=['course']),
            models.Index(fields=['status']),
        ]
        verbose_name = 'Training Assignment'
        verbose_name_plural = 'Training Assignments'
    
    def __str__(self):
        return f"{self.employee.name} - {self.course.title}"
    
    @property
    def is_overdue(self):
        """Check if assignment is overdue."""
        return self.due_date < date.today() and self.status != 'Completed'
    
    def update_status_if_overdue(self):
        """Update status to Overdue if past due date."""
        if self.is_overdue and self.status not in ['Completed', 'Overdue']:
            self.status = 'Overdue'
            self.save()
