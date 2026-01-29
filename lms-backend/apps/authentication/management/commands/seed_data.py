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
        admin_email = 'admin@example.com'
        if not User.objects.filter(email=admin_email).exists():
            User.objects.create_superuser(
                username='admin',
                email=admin_email,
                password='admin123',
                employee_code='ADMIN001',
                name='System Admin',
                department='IT',
                role='Admin'
            )
            self.stdout.write(self.style.SUCCESS('Created admin user'))
        else:
            self.stdout.write('Admin user already exists')

        admin = User.objects.get(email=admin_email)

        # Create Employees
        departments = ['Production', 'Quality', 'Maintenance', 'Logistics']
        employees = []
        for i in range(1, 11):
            email = f'employee{i}@example.com'
            if not User.objects.filter(email=email).exists():
                emp = User.objects.create_user(
                    username=f'employee{i}',
                    email=email,
                    password='password123',
                    employee_code=f'EMP{i:03d}',
                    name=f'Employee {i}',
                    department=random.choice(departments),
                    role='Employee'
                )
                employees.append(emp)
        self.stdout.write(self.style.SUCCESS(f'Created/Checked {len(employees)} new employees'))
        
        # Refresh employees list
        employees = list(User.objects.filter(role='Employee'))

        # Create Courses
        courses_data = [
            ('Safety Basics', 'Introduction to shop floor safety', 'Safety', 60),
            ('Machine Operation 101', 'Basic machine handling', 'Technical', 120),
            ('Quality Control Standards', 'ISO 9001 basics', 'Quality', 90),
            ('5S Methodology', 'Workplace organization', 'Process', 45),
        ]
        
        created_courses = []
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
                created_courses.append(course)
            else:
                created_courses.append(course)
        
        self.stdout.write(self.style.SUCCESS(f'Created/Checked {len(created_courses)} courses'))

        # Create Assignments
        if employees and created_courses:
            for emp in employees:
                # Assign random course
                course = random.choice(created_courses)
                if not TrainingAssignment.objects.filter(course=course, employee=emp).exists():
                    assignment = TrainingAssignment.objects.create(
                        course=course,
                        employee=emp,
                        assigned_by=admin,
                        assigned_date=timezone.now().date(),
                        due_date=timezone.now().date() + timedelta(days=7),
                        status='Pending'
                    )
                    
                    # Create progress records
                    for lesson in course.lessons.all():
                        LessonProgress.objects.create(
                            assignment=assignment,
                            lesson=lesson,
                            employee=emp
                        )
                    self.stdout.write(f'Assigned {course.title} to {emp.name}')
        
        self.stdout.write(self.style.SUCCESS('Data seeding completed successfully!'))
