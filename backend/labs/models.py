from django.db import models

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
        ("Imaging", "Imaging"),
        ("Biopsy", "Biopsy"),
        ("Urine Test", "Urine Test"),
        ("Genetic Test", "Genetic Test"),
        ("Other", "Other"),
    ]

    TEST_CHOICES = [
        ("CBC", "Complete Blood Count (CBC)"),
        ("BloodSugar", "Blood Sugar Test"),
        ("HbA1c", "HbA1c (Diabetes Test)"),
        ("LipidProfile", "Lipid Profile (Cholesterol Test)"),
        ("Thyroid", "Thyroid Function Test (T3, T4, TSH)"),
        ("UrineTest", "Urine Analysis"),
        ("LiverFunction", "Liver Function Test (LFT)"),
        ("KidneyFunction", "Kidney Function Test (KFT)"),
        ("Electrolytes", "Electrolyte Panel"),
        ("CRP", "C-Reactive Protein (CRP) Test"),
        ("VitaminD", "Vitamin D Test"),
        ("VitaminB12", "Vitamin B12 Test"),
        ("IronPanel", "Iron Panel (Ferritin, TIBC)"),
        ("GeneticTest", "Genetic Testing"),
        ("Other", "Other"),
    ]

    name = models.CharField(max_length=100, unique=True, choices=TEST_CHOICES)
    label = models.CharField(max_length=255) 
    description = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="Other")
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Consider a default if commonly used
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.label} ({self.category})"


    
# class TestRequest(models.Model):
#     patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'Patient'})
#     test_type = models.ForeignKey(TestType, on_delete=models.CASCADE)
#     requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="test_requests")
#     status_choices = [
#         ('Pending', 'Pending'),
#         ('In Progress', 'In Progress'),
#         ('Completed', 'Completed'),
#         ('Cancelled', 'Cancelled'),
#     ]
#     status = models.CharField(max_length=20, choices=status_choices, default='Pending')
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.patient.get_full_name()} - {self.test_type.name}"


# class TestResult(models.Model):
#     test_request = models.OneToOneField(TestRequest, on_delete=models.CASCADE)
#     technician = models.ForeignKey(LabTechnician, on_delete=models.SET_NULL, null=True)
#     result_data = models.TextField()  # Can store formatted JSON or plain text
#     report_file = models.FileField(upload_to='lab_reports/', null=True, blank=True)
#     issued_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Result for {self.test_request.patient.get_full_name()} - {self.test_request.test_type.name}"
