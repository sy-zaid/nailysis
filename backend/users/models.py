from django.db import models
from django.contrib.auth.models import AbstractUser, Group, BaseUserManager
from django.core.validators import FileExtensionValidator

import datetime

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
    user_id = models.CharField(max_length=20, unique=True, blank=True, null=False, primary_key=True)
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
        is_new = self._state.adding  # Check if it's a new user
        if not self.user_id:
            self.user_id = self.generate_custom_user_id()
        super().save(*args, **kwargs)

            # Auto-create related role object if missing
        if is_new and self.role == 'clinic_admin' and not hasattr(self, 'clinic_admin'):
            ClinicAdmin.objects.create(user=self)

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
    
    @classmethod
    def create_walkin_account(cls,first_name,last_name,email,phone,date_of_birth,gender):
        if not email:
            email = f"walkin_{int(datetime.datetime.now().timestamp())}@example.com"
            
        walkin_user = cls.objects.create(first_name = first_name,last_name=last_name,email=email,phone=phone,role="patient")
        patient = Patient.objects.create(user=walkin_user,date_of_birth=date_of_birth,gender=gender)
        return patient

""" 
Below are the child classes for CustomUserClass targetting individual Users Types for additional fields specific to its role.
"""

class ClinicAdmin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,primary_key=True, to_field="user_id",related_name="clinic_admin")    
    def __str__(self):
        return f"Clinic Admin - {self.user.email}"

class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,primary_key=True, to_field="user_id")
    license_number = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=255)
    qualifications = models.TextField(blank=True,null=True)
    medical_degree = models.CharField(max_length=255)
    years_of_experience = models.PositiveIntegerField()
    emergency_contact = models.CharField(max_length=20)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
    
class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,primary_key=True, to_field="user_id")
    date_of_birth = models.DateField()
    
    GENDER_CHOICES = [
        ('M','Male'),
        ('F','Female'),
        ('O','Other'),
        ('P','Prefer Not To Say'),
    ]
    gender = models.CharField(max_length=1,choices=GENDER_CHOICES,blank=True,null=True)
    address = models.TextField(blank=True, null=True)
    medical_history = models.JSONField(blank=True,null=True)
    emergency_contact = models.CharField(max_length=20,null=True)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
    
    # def create_walkin_account(self):
        
        
    
class LabAdmin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True, to_field="user_id", related_name="lab_admin")
    license_number = models.CharField(max_length=50,unique=True)
    designation = models.CharField(max_length=100)
    qualifications = models.TextField(blank=True,null=True)
    years_of_experience = models.PositiveIntegerField()
    specialization = models.CharField(max_length=255)
    emergency_contact = models.CharField(max_length=20)
    
class LabTechnician(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE,primary_key=True, to_field="user_id")
    license_number = models.CharField(max_length=50,unique=True)
    specialization = models.CharField(max_length=255)
    years_of_experience = models.PositiveIntegerField()
    lab_skills = models.TextField()
    shift_timings = models.JSONField(default=dict)  
    emergency_contact = models.CharField(max_length=20)
    