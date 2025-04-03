from django.db import models
from appointments.models import TechnicianAppointment
from users.models import LabTechnician
class LabTestType(models.Model):
    """
    Represents a type of laboratory test. ONLY 4 TYPES OF TESTS ARE AVAILABLE IN THE SYSTEM.
    
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
    Represents a lab test order, linking a technician's appointment to multiple lab tests.

    - Each order is associated with a TechnicianAppointment.
    - Supports multiple test types per order.
    - Tracks test status and result availability.

    Attributes:
        lab_technician_appointment (ForeignKey): The related technician appointment.
        test_types (ManyToManyField): The tests included in this order.
        test_status (str): The current status of the test order.
        results_available (bool): Whether all test results are available.
        created_at (DateTime): Timestamp for when the order was created.
        updated_at (DateTime): Timestamp for the last update.
    """

    TEST_STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("In Progress", "In Progress"),
        ("Review Required", "Review Required"),
        ("Completed", "Completed"),
        ("Canceled", "Canceled"),
    ]

    lab_technician_appointment = models.ForeignKey(
        TechnicianAppointment, on_delete=models.CASCADE, related_name="test_orders"
    )
    test_types = models.ManyToManyField(
        LabTestType, related_name="test_orders"
    )
    test_status = models.CharField(max_length=20, choices=TEST_STATUS_CHOICES, default="Pending")
    results_available = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lab Test Order (ID: {self.id}) - Status: {self.test_status}"

    def update_status(self, status):
        """
        Updates the status of the lab test order.
        
        Ensures the new status is valid before updating.
        """
        valid_statuses = [choice[0] for choice in self.TEST_STATUS_CHOICES]
        if status not in valid_statuses:
            raise ValueError(f"Invalid status '{status}'. Choose from {valid_statuses}")
        
        self.test_status = status
        self.save()
              
class LabTestResult(models.Model):
    """
    Stores lab test results for various test types.

    - Blood tests: Stored as JSON (e.g., Hemoglobin: 15.2 g/dL)
    - Imaging & Pathology: File upload with text-based descriptions
    - Supports multiple result formats, including numeric values, boolean indicators, and textual comments.

    Example API format for blood tests:
    {
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

    test_order = models.ForeignKey(
        LabTestOrder, on_delete=models.CASCADE, related_name="test_results"
    )
    test_type = models.ForeignKey(
        LabTestType, on_delete=models.CASCADE, related_name="test_results"
    )

    numeric_results = models.JSONField(null=True, blank=True)  # Stores numerical values for lab tests
    boolean_results = models.JSONField(null=True, blank=True)  # Stores Positive/Negative test outcomes
    comments = models.TextField(null=True, blank=True)  # Pathologist notes or imaging descriptions
    result_file = models.FileField(upload_to="lab_results/", null=True, blank=True)  # Upload field for reports

    RESULT_STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Finalized", "Finalized"),
        ("Review Required", "Review Required"),
    ]
    
    reviewed_by = models.ForeignKey(LabTechnician, on_delete=models.SET_NULL, null=True, blank=True)
    reviewed_at = models.DateTimeField(auto_now_add=True)
    result_status = models.CharField(max_length=20, choices=RESULT_STATUS_CHOICES, default="Pending")

    def __str__(self):
        return f"Results for Order {self.test_order.id}"
    
    