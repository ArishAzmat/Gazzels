from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import uuid


class UserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier
    instead of username.
    """
    def create_user(self, email, employee_code, name, password=None, **extra_fields):
        """
        Create and save a regular user with the given email, employee_code, and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        if not employee_code:
            raise ValueError('The Employee Code field must be set')
        if not name:
            raise ValueError('The Name field must be set')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            employee_code=employee_code,
            name=name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, employee_code, name, password=None, **extra_fields):
        """
        Create and save a superuser with the given email, employee_code, and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'Admin')
        extra_fields.setdefault('department', 'Administration')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, employee_code, name, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Represents both Admin and Employee users.
    """
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Employee', 'Employee'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee_code = models.CharField(max_length=50, unique=True)
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    department = models.CharField(max_length=100, db_index=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Employee')
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Override username requirement
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['employee_code', 'name']
    
    # Use custom manager
    objects = UserManager()
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['employee_code']),
            models.Index(fields=['email']),
            models.Index(fields=['department']),
        ]
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.name} ({self.employee_code})"
    
    def save(self, *args, **kwargs):
        # Auto-generate username from email if not provided
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)
