from django.db import models
from django.contrib.auth.models import AbstractUser, Group, BaseUserManager
from django.core.validators import FileExtensionValidator
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
    
    """Fields from the class diagram v1.1"""
    # Custom user ID field
    user_id = models.CharField(max_length=20, unique=True, blank=True, null=True)
    #first_name = default from AbstractUser
    #last_name = default from AbstractUser
    email = models.EmailField(max_length=254,unique=True)
    #password = default from AbstractUser
    phone = models.CharField(max_length=20,blank=True, null=True)
    role = models.CharField(max_length=20, choices=user_roles, default="patient")
    date_joined = models.DateTimeField(auto_now_add=True)
    #last_login = default from AbstractUser
    #is_active = default from AbstractUser
    #is_staff = default from AbstractUser
    #is_superuser= default from AbstractUser
    profile_picture = models.ImageField(upload_to="profile_pics/",blank=True, null=True, validators=[FileExtensionValidator(allowed_extensions=["jpg","png"])])   
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name','role']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    
    def has_role(self,role_name):
        return self.role == role_name
    
    def save(self,*args,**kwargs):
        if not self.user_id:
            self.user_id = self.generate_custom_user_id()
        super().save(*args, **kwargs)
    
    def generate_custom_user_id(self):
        role_prefixes = {
            'patient': 'PAT',
            'doctor': 'DOC',
            'clinic_admin': 'CA',
            'lab_admin': 'LA',
            'lab_technician': 'LT',
            'system_admin': 'SA',
        }
        # Get the role-specific prefix
        prefix = role_prefixes.get(self.role, 'USER')
        # Generate user ID with a 3-digit number (e.g., PAT001, DOC002, etc.)
        count = CustomUser.objects.filter(role=self.role).count() + 1
        #REMOVE
        print(f"{prefix}{str(count).zfill(3)}")
        
        return f"{prefix}{str(count).zfill(3)}"
    
""" 
Below are the child classes for CustomUserClass targetting individual Users Types for additional fields specific to its role.
"""

class ClinicAdmin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,primary_key=True)