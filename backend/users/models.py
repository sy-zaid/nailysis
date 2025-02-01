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
    def __str__(self):
        return f"Clinic Admin - {self.user.email}"

class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,primary_key=True)
    license_number = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=255)
    qualifications = models.TextField(blank=True,null=True)
    medical_degree = models.CharField(max_length=255)
    years_of_experience = models.PositiveIntegerField()
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2)
    emergency_contact = models.CharField(max_length=20)
    
    
class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
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
    
class LabAdmin(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE,primary_key=True)
    license_number = models.CharField(max_length=50,unique=True)
    designation = models.CharField(max_length=100)
    qualifications = models.TextField(blank=True,null=True)
    years_of_experience = models.PositiveIntegerField()
    specialization = models.CharField(max_length=255)
    emergency_contact = models.CharField(max_length=20)
    
class LabTechnician(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE,primary_key=True)
    license_number = models.CharField(max_length=50,unique=True)
    specialization = models.CharField(max_length=255)
    years_of_experience = models.PositiveIntegerField()
    lab_skills = models.TextField()
    shift_timings = models.JSONField(default=dict)  
    emergency_contact = models.CharField(max_length=20)
    
    
"""
Creating rest of the models for the system
"""

class EHR(models.Model):
    patient = models.ForeignKey('Patient', on_delete=models.CASCADE)
    record_id = models.AutoField(primary_key=True)
    current_allergies = models.JSONField(blank=True, null=True)
    current_medications = models.JSONField(blank=True, null=True)
    immunization_records = models.JSONField(blank=True, null=True)
    nail_image_analysis = models.JSONField(blank=True, null=True)
    test_results = models.JSONField(blank=True, null=True)
    diagnoses = models.JSONField(blank=True, null=True)
    visits = models.JSONField(blank=True, null=True)
    family_history = models.TextField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    comments = models.TextField(blank=True, null=True)

    def create_record(self):
        # Logic to create a new record
        self.save()

    def update_record(self, data):
        # Logic to update the record with new data
        for key, value in data.items():
            setattr(self, key, value)
        self.save()

    def share_record(self):
        # Logic to share the record (e.g., with another provider)
        pass

    def generate_report(self):
        # Logic to generate a report based on the record
        pass

    def add_test_results(self, test_data):
        self.test_results.append(test_data)
        self.save()

    def add_diagnosis(self, diagnosis_data):
        self.diagnoses.append(diagnosis_data)
        self.save()

    def add_medication(self, medication_data):
        self.current_medications.append(medication_data)
        self.save()

    def view_patient_history(self):
        # Logic to view the entire history of a patient
        return EHR.objects.filter(patient=self.patient)

    def delete_record(self):
        # Logic to delete the record
        self.delete()

    def __str__(self):
        return f"EHR Record for {self.patient.first_name} {self.patient.last_name}"

