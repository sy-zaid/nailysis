from django.db import models
from django.contrib.auth.models import AbstractUser, Group, BaseUserManager
# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a regular user with the given email and password.
        """
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)
    
class CustomUser(AbstractUser):
    username = None
    user_roles = [
    ('system_admin', 'System Admin'),
    ('clinic_admin', 'Clinic Admin'),
    ('doctor', 'Doctor'),
    ('patient', 'Patient'),
    ('lab_admin', 'Lab Admin'),
    ('lab_technician', 'Lab Technician'),
]
    
    groups = models.ManyToManyField(Group, blank=True) 
    email = models.EmailField(max_length=254,unique=True)
    phone = models.CharField(max_length=20,blank=True, null=True)
    
    # Add more fields here.
    role = models.CharField(max_length=20, choices=user_roles, default="patient")
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name','role']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
    def has_role(self,role_name):
        return self.role == role_name
    
