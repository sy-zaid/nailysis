from django.db import models
from appointments.models import TechnicianAppointment
from users.models import LabTechnician
class LabTestType(models.Model):
    """
    Represents a type of laboratory test.
    
    Attributes:
        name (str): Short identifier for the test (e.g., "CBC", "LipidProfile").
        label (str): Full user-friendly test name.
        description (str): Brief details about the test.
        category (str): Test category (e.g., "Blood Test", "Imaging", "Biopsy").
        price (Decimal): Default price for the test (optional).
        created_at (DateTime): Timestamp when the test type was added.
    """

    CATEGORY_CHOICES = [
    ("Blood Test", "Blood Test"),
    ("Imaging Test", "Imaging Test"),
    ("Pathology Report", "Pathology Report"),
    ("Urine Test", "Urine Test"),
    ]

    TEST_CHOICES = [
    # Blood Tests
    ("CBC", "Complete Blood Count (CBC)"),
    ("BloodSugar", "Blood Sugar Test"),
    ("HbA1c", "HbA1c (Diabetes Test)"),
    ("LipidProfile", "Lipid Profile (Cholesterol Test)"),
    ("Thyroid", "Thyroid Function Test (T3, T4, TSH)"),
    ("LiverFunction", "Liver Function Test (LFT)"),
    ("KidneyFunction", "Kidney Function Test (KFT)"),
    ("Electrolytes", "Electrolyte Panel"),
    ("CRP", "C-Reactive Protein (CRP) Test"),
    ("VitaminD", "Vitamin D Test"),
    ("VitaminB12", "Vitamin B12 Test"),
    ("IronPanel", "Iron Panel (Ferritin, TIBC)"),

    # Urine Tests
    ("UrineTest", "Urine Analysis"),

    # Imaging Tests
    ("XRay", "X-Ray"),
    ("MRI", "Magnetic Resonance Imaging (MRI)"),
    ("CTScan", "Computed Tomography (CT) Scan"),
    ("Ultrasound", "Ultrasound"),

    # Pathology Reports
    ("Biopsy", "Biopsy"),
    ("Histopathology", "Histopathology"),
    ]
    name = models.CharField(max_length=100, unique=True, choices=TEST_CHOICES)
    label = models.CharField(max_length=255) 
    description = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="Other")
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Consider a default if commonly used
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.label} ({self.category})"

class LabTestOrder(models.Model):
    """
    Represents a lab test order, linking an appointment to multiple lab tests.
    
    Attributes:
        appointment (ForeignKey): The related TechnicianAppointment.
        test_type (ForeignKey): The specific test being conducted.
        test_status (str): Status of the test (Pending, In Progress, Completed, etc.).
        results_available (bool): Indicates if the results are available.
        assigned_technician (ForeignKey): Technician assigned to conduct the test.
        created_at (DateTime): Timestamp for when the order was created.
        updated_at (DateTime): Timestamp for the last update.
    """
    TEST_STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
        ("Canceled", "Canceled"),
    ]
    
    lab_technician_appointment = models.ForeignKey(TechnicianAppointment, on_delete=models.CASCADE, related_name="test_orders")
    test_types = models.ManyToManyField(  # 🔹 Change ForeignKey to ManyToManyField
        LabTestType, 
        related_name="test_orders"
    )
    test_status = models.CharField(max_length=20, choices=TEST_STATUS_CHOICES, default="Pending")
    results_available = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.test_type.name} - {self.test_status} ({self.appointment})"
class LabTestResult(models.Model):
    """
    Stores lab test results for various test types.
    - Blood tests → JSONField (e.g., Hemoglobin: 15.2 g/dL)
    - Imaging/Pathology → File upload + Description
    
    { API FORMAT FOR BLOOD TESTS
    "test_order_id": 1,
    "numeric_results": {
        "Hemoglobin": {
        "value": 15.2,
        "unit": "g/dL",
        "range": "13.5 - 17.5"
        },
        "WBC": {
        "value": 5400,
        "unit": "cells/mcL",
        "range": "4,500 - 11,000"
        }
    }
    }

    """

    test_order = models.OneToOneField(
        'LabTestOrder', on_delete=models.CASCADE, related_name="test_result"
    )

    # JSON field for numeric results (e.g., Blood Test, Urine Test)
    numeric_results = models.JSONField(null=True, blank=True)  
    # Example: {"Hemoglobin": 13.5, "WBC": 7000, "pH": 6.0}

    # JSON field for Positive/Negative results (e.g., Urine Test parameters)
    boolean_results = models.JSONField(null=True, blank=True)  
    # Example: {"Glucose": "Negative", "Protein": "Positive"}

    # Text-based results (e.g., pathologist's notes, imaging descriptions)
    comments = models.TextField(null=True, blank=True)

    # File upload for Imaging & Pathology Reports
    result_file = models.FileField(upload_to='lab_results/', null=True, blank=True)

    # Metadata
    reviewed_by = models.ForeignKey(LabTechnician, on_delete=models.SET_NULL, null=True, blank=True)
    reviewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Results for Order {self.test_order.id}"

    # def save(self, *args, **kwargs):
    #     """
    #     Ensure JSON fields are properly formatted before saving.
    #     """
    #     if isinstance(self.numeric_results, dict):
    #         self.numeric_results = json.dumps(self.numeric_results)
    #     if isinstance(self.boolean_results, dict):
    #         self.boolean_results = json.dumps(self.boolean_results)
    #     super().save(*args, **kwargs)
    
    
    