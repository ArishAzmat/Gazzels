from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from django.utils import timezone
from .models import LessonProgress
from .serializers import LessonProgressSerializer, MarkLessonCompleteSerializer
from apps.assignments.models import TrainingAssignment
from apps.courses.models import Lesson


class ProgressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for tracking lesson progress.
    Employees can mark lessons as complete.
    """
    queryset = LessonProgress.objects.all()
    serializer_class = LessonProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Admin':
            return LessonProgress.objects.all()
        return LessonProgress.objects.filter(employee=user)

    @extend_schema(
        request=MarkLessonCompleteSerializer,
        responses={200: LessonProgressSerializer},
        description='Mark a lesson as complete'
    )
    @action(detail=False, methods=['post'])
    def mark_complete(self, request):
        serializer = MarkLessonCompleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        assignment_id = serializer.validated_data['assignment_id']
        lesson_id = serializer.validated_data['lesson_id']
        
        try:
            assignment = TrainingAssignment.objects.get(id=assignment_id, employee=request.user)
            lesson = Lesson.objects.get(id=lesson_id)
            
            progress, created = LessonProgress.objects.get_or_create(
                assignment=assignment,
                lesson=lesson,
                employee=request.user
            )
            
            if not progress.is_completed:
                progress.is_completed = True
                progress.completed_at = timezone.now()
                progress.save()
                
                # Update assignment status if needed
                if assignment.status == 'Pending':
                    assignment.status = 'InProgress'
                    assignment.started_at = timezone.now()
                    assignment.save()
                
                # Check if all lessons are completed
                total_lessons = Lesson.objects.filter(course=assignment.course).count()
                completed_lessons = LessonProgress.objects.filter(
                    assignment=assignment,
                    is_completed=True
                ).count()
                
                if total_lessons == completed_lessons:
                    assignment.status = 'Completed'
                    assignment.completed_at = timezone.now()
                    assignment.save()
            
            return Response(LessonProgressSerializer(progress).data)
            
        except TrainingAssignment.DoesNotExist:
            return Response({'detail': 'Assignment not found or does not belong to you'}, status=status.HTTP_404_NOT_FOUND)
        except Lesson.DoesNotExist:
            return Response({'detail': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)
