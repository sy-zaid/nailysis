from django.shortcuts import render

from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from django.template.loader import render_to_string
from django.http import HttpResponse
from weasyprint import HTML

from .models import LabTestType,LabTestOrder,LabTestResult
from .serializers import LabTestTypeSerializer,LabTestOrderSerializer,LabTestResultSerializer
from users.serializers import PatientSerializer
from users.models import Patient
from users.models import LabTechnician
import json

class LabTestTypeModelViewSet(viewsets.ModelViewSet):
    queryset = LabTestType.objects.all()
    serializer_class = LabTestTypeSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return LabTestType.objects.all()

class LabTestOrderModelViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing lab test orders.
    Provides CRUD operations and functionalities for submitting and finalizing test reports.
    """
    queryset = LabTestOrder.objects.all()
    serializer_class = LabTestOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Retrieve lab test orders based on user role and optional test order ID filter.

        - Patients can only see their own lab test orders
        - Restricted to 'lab_technician' and 'lab_admin' roles for all orders
        - If a test order ID is provided, fetches the specific order (with permission check)
        """
        user = self.request.user
        patient = Patient()
        if user.role == "patient":
            try:
                patient = Patient.objects.get(user=user)
                return LabTestOrder.objects.filter(
                    lab_technician_appointment__patient=patient,
                    results_available=True,
                    test_status="Completed"
                )
            except Patient.DoesNotExist:
                return LabTestOrder.objects.none()
            
        if user.role not in ["lab_technician", "lab_admin"]:
            return Response({"error": "Access denied. You do not have permission to view test orders."}, status=403)
        
        test_order_id = self.request.query_params.get("id")
        if test_order_id:
            return LabTestOrder.objects.filter(id=test_order_id)
        
        return LabTestOrder.objects.all()
        
    @action(detail=False, methods=["post"], url_path="submit_results")
    def submit_results(self, request):
        """
        Submits lab test results and updates the test order status.

        - Allowed for 'lab_technician' and 'lab_admin' roles.
        - Ensures all required test results are provided.
        - Updates the test order status to 'In Progress' if all results are available.
        """
        user = self.request.user
        if user.role not in ["lab_technician", "lab_admin"]:
            return Response({"error": "Access denied. You do not have permission to submit test reports."}, status=403)

        test_order_id = request.data.get("test_order_id")
        test_order = get_object_or_404(LabTestOrder, id=test_order_id)

        requested_test_ids = set(test_order.test_types.values_list("id", flat=True))
        available_test_ids = set(LabTestResult.objects.filter(test_order=test_order).values_list("test_type_id", flat=True))

        if requested_test_ids.issubset(available_test_ids): 
            test_order.update_status("In Progress")
            return Response({"message": "Test results submitted successfully. The test order is now in progress."}, status=200)

        return Response({
            "error": "Some test results are missing.",
            "missing_tests": list(requested_test_ids - available_test_ids)
        }, status=400)
    
    @action(detail=True, methods=["post"], url_path="finalize_test_order")
    def finalize_test_order(self,request, pk=None):
        """
        Finalizes a test order if all required test results are submitted and finalized.

        - Only 'lab_admin' can finalize test orders.
        - Ensures all requested test results are available.
        - Checks if all results are marked as 'Finalized' before completion.
        - Updates the test order status to 'Completed'.
        """
        user = self.request.user
        if user.role != "lab_admin":
            return Response({"error": "Access denied. Only lab admins can finalize test orders."}, status=403)

        test_order = get_object_or_404(LabTestOrder, pk=pk)

        requested_test_ids = set(test_order.test_types.values_list("id", flat=True))
        available_results = LabTestResult.objects.filter(test_order=test_order, test_type_id__in=requested_test_ids).all()
        available_test_ids = set(available_results.values_list("test_type_id", flat=True))

        if not requested_test_ids.issubset(available_test_ids):
            return Response({
                "error": "Finalization failed. Some test results are missing.",
                "missing_tests": list(requested_test_ids - available_test_ids)
            }, status=400)

        not_finalized_tests = [
            result.test_type_id for result in available_results if result.result_status != "Finalized"
        ]

        if not_finalized_tests:
            return Response({
                "error": "Finalization failed. Some test results are not yet finalized.",
                "not_finalized_tests": not_finalized_tests
            }, status=400)

        test_order.update_status("Completed")
        return Response({"message": "All test results finalized. The test order is now marked as completed."}, status=200)
 
class LabTestResultModelViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing lab test results with role-based access control.
    """

    queryset = LabTestResult.objects.all()
    serializer_class = LabTestResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retrieves lab test results based on user role.

        - Lab technicians and lab admins can access test results.
        - Supports filtering by:
            * `test_order_id` - returns results for specific order
            * `test_id` - returns specific test result
            * `patient_id` - returns all finalized results for a patient
        """
        user = self.request.user
        if user.role not in ["lab_technician", "lab_admin","patient","doctor","clinic_admin"]:
            raise PermissionDenied("Access denied: You are not authorized to view test results.")

        test_order_id = self.request.query_params.get("test_order_id")
        test_id = self.request.query_params.get("test_id")

        if test_order_id:
            return LabTestResult.objects.filter(test_order_id=test_order_id)
        if test_id:
            return LabTestResult.objects.filter(id=test_id)
        
        return LabTestResult.objects.all()
    
    @action(detail=False, methods=["get"], url_path="all_tests")
    def get_all_test_results(self, request):
        # Check user permissions
        user = request.user
        if user.role not in ["lab_technician", "lab_admin","doctor","patient","clinic_admin"]:
            raise PermissionDenied("Access denied: You are not authorized to view test results.")

        patient_id = request.query_params.get("patient_id")
        if not patient_id:
            return Response(
                {"error": "patient_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get patient and their test results
            patient = get_object_or_404(Patient, user_id=patient_id)
            all_test_results = LabTestResult.objects.filter(
                test_order__lab_technician_appointment__patient_id=patient_id,
                result_status="Finalized"
            ).select_related(
                'test_order',
                'test_order__lab_technician_appointment',
                'test_type'
            )

            serializer = LabTestResultSerializer(all_test_results, many=True)
            
            return Response({
                "tests": serializer.data,
                "patient": PatientSerializer(patient).data
            })

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=["post"], url_path="save_results")
    def save_results(self, request):
        """
        Saves or updates a lab test result.

        - Updates existing results if a record is found for the given test_order and test_type.
        - Creates a new result if none exists.
        - Only lab technicians can create or update test results.
        """
        user = self.request.user
        result_files = []
        
        if user.role != "lab_technician":
            return Response({"error": "Access denied: Only lab technicians can create test results."}, status=status.HTTP_403_FORBIDDEN)

        test_category = request.data.get("test_category")
        # Check for pathology or imaging category
        if test_category == "Pathology" or test_category == "Imaging":
            # Get multiple files for imaging tests (result_file can be a list of files)
            result_files = request.FILES.getlist("result_file")
            print("Received files:", result_files)
        
        # Retrieve other data
        test_order_id = request.data.get("test_order_id")
        test_type_id = request.data.get("test_type_id")
        technician_id = request.data.get("technician_id")
        test_entries = request.data.get("test_entries", "[]")
        comments = request.data.get("comments", "")

        if not all([test_order_id, technician_id, test_type_id]):
            return Response({"error": "Missing required fields: test_order_id, test_type_id, and technician_id."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if isinstance(test_entries, str):
                test_entries = json.loads(test_entries)

            test_order = get_object_or_404(LabTestOrder, id=test_order_id)
            lab_technician = get_object_or_404(LabTechnician, user_id=technician_id)
            test_type = get_object_or_404(LabTestType, id=test_type_id)

            # Handle file upload for multiple files (if any)
            imaging_results = []
            if result_files:
                for file in result_files:
                    # You can save each image to your desired directory or storage system
                    file_path = file.name  # Adjust this as needed for your storage (e.g., a URL or a local path)
                    imaging_results.append(file_path)

            # Create or update the lab test result
            test_result, created = LabTestResult.objects.update_or_create(
                test_order=test_order,
                test_type=test_type,
                defaults={
                    "numeric_results": test_entries,
                    "comments": comments,
                    "reviewed_by": lab_technician,
                    "result_status": "Pending",
                    "result_file": result_files[0] if result_files else None,  # Store the first file as the result_file (or leave it empty)
                    "imaging_results": imaging_results,  # Save the multiple images' paths/URLs
                }
            )

            return Response(
                {
                    "message": f"Test result {'updated' if not created else 'saved'} successfully.",
                    "test_result_id": test_result.id,
                    "test_order_id": test_order.id,
                    "reviewed_by": lab_technician.user_id
                },
                status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED
            )

        except json.JSONDecodeError:
            return Response({"error": "Invalid format: test_entries must be a valid JSON array."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=["put"], url_path="edit_results")
    def edit_results(self, request):
        """
        Edits an existing lab test result.

        - Updates existing results if a record is found for the given test_order and test_type.
        - Only lab technicians can edit test results.
        """
        user = self.request.user
        if user.role != "lab_technician":
            return Response({"error": "Access denied: Only lab technicians can edit test results."}, status=status.HTTP_403_FORBIDDEN)

        test_result_id = request.data.get("test_result_id")
        test_entries = request.data.get("test_entries", "[]")
        comments = request.data.get("comments", "")

        if not test_result_id:
            return Response({"error": "Missing required field: test_result_id."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if isinstance(test_entries, str):
                test_entries = json.loads(test_entries)

            test_result = get_object_or_404(LabTestResult, id=test_result_id)

            # Update the existing test result
            test_result.numeric_results = test_entries
            test_result.comments = comments
            test_result.save()

            return Response(
                {
                    "message": "Test result updated successfully.",
                    "test_result_id": test_result.id,
                    "test_order_id": test_result.test_order.id,
                    "updated_by": user.id
                },
                status=status.HTTP_200_OK
            )

        except json.JSONDecodeError:
            return Response({"error": "Invalid format: test_entries must be a valid JSON array."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=["get"], url_path="view_blood_report")
    def view_lab_report_html(self, request, pk=None):
        """Retrieves the blood test report in HTML format."""
        lab_test_result = get_object_or_404(LabTestResult, pk=pk)
        return render(request, 'labs/blood-test-report.html', {'lab_test_result': lab_test_result})

    @action(detail=True, methods=["get"], url_path="generate_blood_report")
    def generate_lab_report_pdf(self, request, pk=None):
        """Generates a downloadable PDF report for the specified lab test result."""
        lab_test_result = get_object_or_404(LabTestResult, pk=pk)
        html_content = render_to_string('labs/blood-test-report.html', {'lab_test_result': lab_test_result})
        pdf_file = HTML(string=html_content).write_pdf()

        response = HttpResponse(pdf_file, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="Lab_Report_{pk}.pdf"'
        return response

    @action(detail=True, methods=["post"], url_path="add_comment")
    def submit_admin_comments(self, request, pk=None):
        """
        Allows lab admins to add comments to a lab test result.

        - Comments cannot be modified if the test result is finalized.
        - Only lab admins can submit comments.
        """
        user = self.request.user
        if user.role != "lab_admin":
            return Response({"error": "Access denied: Only lab admins can add comments."}, status=status.HTTP_403_FORBIDDEN)

        admin_comment = request.data.get("admin_comment")
        try:
            test_result = LabTestResult.objects.get(pk=pk)
            if test_result.is_marked_finalized():
                return Response({"error": "Action denied: Lab test result is finalized."}, status=status.HTTP_400_BAD_REQUEST)
            test_result.add_admin_comment(admin_comment)
            test_result.test_order.update_status("Review Required")
            return Response({"message": "Comment added successfully."}, status=status.HTTP_200_OK)
        except LabTestResult.DoesNotExist:
            return Response({"error": "Test result not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["post"], url_path="mark_finalized")
    def mark_finalized(self,request, pk=None):
        """
        Allows a lab admin to finalize a test result.

        - Once finalized, results cannot be modified.
        - Only lab admins can perform this action.
        """
        user = self.request.user
        if user.role != "lab_admin":
            return Response({"error": "Access denied: Only lab admins can finalize results."}, status=status.HTTP_403_FORBIDDEN)

        try:
            test_result = LabTestResult.objects.get(pk=pk)
            if test_result.is_marked_finalized():
                return Response({"error": "Action denied: Lab test result is already finalized."}, status=status.HTTP_400_BAD_REQUEST)
            test_result.mark_finalized()
            return Response({"message": "Lab test result finalized successfully."}, status=status.HTTP_200_OK)
        except LabTestResult.DoesNotExist:
            return Response({"error": "Test result not found."}, status=status.HTTP_404_NOT_FOUND)
