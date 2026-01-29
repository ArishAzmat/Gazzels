from django.core.management.base import BaseCommand
from apps.authentication.models import User
from apps.courses.models import Course, Lesson
from apps.assignments.models import TrainingAssignment
from apps.progress.models import LessonProgress
from django.utils import timezone
import random
from datetime import timedelta


class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
        
        # Create Admin
        admin, created = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'username': 'admin',
                'employee_code': 'ADMIN001',
                'name': 'System Admin',
                'department': 'IT',
                'role': 'Admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Created admin user'))

        # Create Employees
        departments = ['Production', 'Quality', 'Maintenance', 'Logistics']
        employees = []
        for i in range(1, 11):
            emp, created = User.objects.get_or_create(
                email=f'employee{i}@example.com',
                defaults={
                    'username': f'employee{i}',
                    'employee_code': f'EMP{i:03d}',
                    'name': f'Employee {i}',
                    'department': random.choice(departments),
                    'role': 'Employee'
                }
            )
            if created:
                emp.set_password('password123')
                emp.save()
                employees.append(emp)
        self.stdout.write(self.style.SUCCESS(f'Created {len(employees)} employees'))

        # Create Courses
        courses_data = [
            ('Safety Basics', 'Introduction to shop floor safety', 'Safety', 60),
            ('Machine Operation 101', 'Basic machine handling', 'Technical', 120),
            ('Quality Control Standards', 'ISO 9001 basics', 'Quality', 90),
            ('5S Methodology', 'Workplace organization', 'Process', 45),
        ]
        
        courses = []
        for title, desc, cat, duration in courses_data:
            course, created = Course.objects.get_or_create(
                title=title,
                defaults={
                    'description': desc,
                    'category': cat,
                    'duration_minutes': duration,
                    'created_by': admin
                }
            )
            if created:
                # Add lessons
                for j in range(1, 4):
                    Lesson.objects.create(
                        course=course,
                        title=f'{title} - Lesson {j}',
                        content=f'Content for lesson {j} of {title}',
                        order=j,
                        duration_minutes=duration // 3
                    )
                courses.append(course)
        self.stdout.write(self.style.SUCCESS(f'Created {len(courses)} courses'))

        # Create Assignments
        if employees and courses:
            for emp in employees:
                # Assign random course
                course = random.choice(courses)
                assignment, created = TrainingAssignment.objects.get_or_create(
                    course=course,
                    employee=emp,
                    defaults={
                        'assigned_by': admin,
                        'assigned_date': timezone.now().date(),
                        'due_date': timezone.now().date() + timedelta(days=7),
                        'status': 'Pending'
                    }
                )
                if created:
                    # Create progress records
                    for lesson in course.lessons.all():
                        LessonProgress.objects.create(
                            assignment=assignment,
                            lesson=lesson,
                            employee=emp
                        )
        
        self.stdout.write(self.style.SUCCESS('Data seeding completed successfully!'))
