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
    ViewSet for managing lab test orders. Provides CRUD operations and
    additional functionalities like submitting test reports.
    """
    queryset = LabTestOrder.objects.all()
    serializer_class = LabTestOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Retrieve lab test orders based on user role and optional test order ID filter.
        Only users with 'lab_technician' or 'lab_admin' roles are authorized.
        """
        user = self.request.user
        if user.role not in ["lab_technician", "lab_admin"]:
            return Response({"error": "Not authorized to view test orders"}, status=403)
        
        test_order_id = self.request.query_params.get("id")
        if test_order_id:
            return LabTestOrder.objects.filter(id=test_order_id)
        
        return LabTestOrder.objects.all()
        
    @action(detail=False, methods=["post"], url_path="submit_results")
    def submit_results(self, request):
        """
        Submits lab test reports and updates test order status.

        - Only lab technicians and lab admins can submit reports.
        - Checks if all requested test results are submitted.
        - Updates test order status to 'Completed' if all results are available.
        - If some results are missing, the status remains 'In Progress'.

        Returns:
        - Success response if all test results are submitted.
        - Error response if some test results are missing.
        """
        user = self.request.user
        if user.role not in ["lab_technician", "lab_admin"]:
            return Response({"error": "Not authorized to submit test reports"}, status=403)

        test_order_id = request.data.get("test_order_id")
        test_order = get_object_or_404(LabTestOrder, id=test_order_id)

        requested_test_ids = set(test_order.test_types.values_list("id", flat=True))
        available_test_ids = set(LabTestResult.objects.filter(test_order=test_order).values_list("test_type_id", flat=True))

        if requested_test_ids.issubset(available_test_ids): 
            test_order.update_status("In Progress")
            return Response({"message": "All test results submitted successfully!"}, status=200)

        return Response({
            "message": "Some test results are missing!",
            "missing_tests": list(requested_test_ids - available_test_ids)
        }, status=400)
    
    @action(detail=True, methods=["post"], url_path="finalize_test_order")
    def finalize_test_order(self, request,pk=None):
        """
        Finalizes a test order if all associated test results are submitted and marked as Finalized.
        """
        user = self.request.user
        if user.role != "lab_admin":
            return Response({"error": "Not authorized to finalize test orders"}, status=403)

        # test_order_id = request.data.get("test_order_id")
        test_order = get_object_or_404(LabTestOrder, pk=pk)

        # Get the requested test types for this order
        requested_test_ids = set(test_order.test_types.values_list("id", flat=True))

        # Get the available test results for this order (force fresh fetch)
        available_results = LabTestResult.objects.filter(test_order=test_order, test_type_id__in=requested_test_ids).all()
        available_test_ids = set(available_results.values_list("test_type_id", flat=True))

        # Debugging prints
        # print(f"Test Order ID: {test_order_id}")
        print(f"Requested Test IDs: {requested_test_ids}")
        print(f"Available Test IDs: {available_test_ids}")
        print(f"Missing Test IDs: {requested_test_ids - available_test_ids}")

        # If some tests are missing, return missing test IDs
        if not requested_test_ids.issubset(available_test_ids):
            return Response({
                "message": "Some test results are missing!",
                "missing_tests": list(requested_test_ids - available_test_ids)
            }, status=400)

        # Force DB refresh
        for result in available_results:
            result.refresh_from_db()
            print(f"Test ID: {result.test_type_id}, Status: {result.result_status}")

        if not_finalized_tests := [
            result.test_type_id
            for result in available_results
            if result.result_status != "Finalized"
        ]:
            return Response({
                "message": "Some test results are not finalized yet!",
                "not_finalized_tests": not_finalized_tests
            }, status=400)

        # If all test results are finalized, update the test order status
        test_order.update_status("Completed")
        return Response({"message": "All test results finalized, order marked as completed!"}, status=200)

       
class LabTestResultModelViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing lab test results.

    Provides endpoints to retrieve and create lab test results while enforcing 
    role-based access control for security.
    """

    queryset = LabTestResult.objects.all()
    serializer_class = LabTestResultSerializer
    permission_classes = [permissions.IsAuthenticated]  # Adjust permissions as needed

    def get_queryset(self):
        """
        Retrieves lab test results based on user role.

        - Only lab technicians and lab admins can access test results.
        - Supports filtering test results by `test_order_id` via query parameters.
        """
        user = self.request.user
        if user.role not in ["lab_technician", "lab_admin"]:
            raise PermissionDenied("Not authorized to view test results.")

        test_order_id = self.request.query_params.get("test_order_id")
        if test_order_id:
            return LabTestResult.objects.filter(test_order_id=test_order_id)

        test_id = self.request.query_params.get("test_id")
        if test_id:
            return LabTestResult.objects.filter(id=test_id)
        
        return LabTestResult.objects.all()

    @action(detail=False, methods=["post"], url_path="save_results")
    def save_results(self, request):
        """
        Saves or updates a lab test result.

        - If a test result already exists for the given test_order and test_type, it updates the existing record.
        - If no result exists, it creates a new one.
        - Only lab technicians can create or update test results.
        """
        user = self.request.user
        if user.role != "lab_technician":
            return Response({"error": "User not authorized to create test report"}, status=status.HTTP_403_FORBIDDEN)

        test_order_id = request.data.get("test_order_id")
        test_type_id = request.data.get("test_type_id")
        technician_id = request.data.get("technician_id")
        test_entries = request.data.get("test_entries", "[]")  # Default to an empty JSON array
        comments = request.data.get("comments", "")

        if not test_order_id or not technician_id or not test_type_id:
            return Response({"error": "test_order_id, test_type_id, and technician_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Parse test_entries if it's a string
            if isinstance(test_entries, str):
                test_entries = json.loads(test_entries)

            # Fetch related objects
            test_order = get_object_or_404(LabTestOrder, id=test_order_id)
            lab_technician = get_object_or_404(LabTechnician, user_id=technician_id)
            test_type = get_object_or_404(LabTestType, id=test_type_id)

            # Check if a test result already exists
            test_result, created = LabTestResult.objects.update_or_create(
                test_order=test_order,
                test_type=test_type,
                defaults={
                    "numeric_results": test_entries,
                    "comments": comments,
                    "reviewed_by": lab_technician
                }
            )

            return Response(
                {
                    "message": "Test result {} successfully".format("updated" if not created else "saved"),
                    "test_result_id": test_result.id,
                    "test_order_id": test_order.id,
                    "reviewed_by": lab_technician.user_id
                },
                status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED
            )

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format for test_entries"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
    @action(detail=True, methods=["get"], url_path="view_blood_report")
    def view_lab_report_html(self, request, pk=None):
        """
        View the blood test report as an HTML page before generating the PDF.
        """
        lab_test_result = get_object_or_404(LabTestResult, pk=pk)

        return render(request, 'labs/blood-test-report.html', {'lab_test_result': lab_test_result})


    @action(detail=True, methods=["get"], url_path="generate_blood_report")
    def generate_lab_report_pdf(self, request, pk=None):
        """Generates a PDF report for a specific LabTestResult (by ID)."""
        lab_test_result = get_object_or_404(LabTestResult, pk=pk)

        # Render the template
        html_content = render_to_string('labs/blood-test-report.html', {'lab_test_result': lab_test_result})

        # Convert HTML to PDF
        pdf_file = HTML(string=html_content).write_pdf()

        # Return the PDF as a response
        response = HttpResponse(pdf_file, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="Lab_Report_{pk}.pdf"'
        return response
    
    @action(detail=True, methods=["post"], url_path="add_comment")
    def submit_admin_comments(self, request, pk=None):
        user = self.request.user
        admin_comment = request.data.get("admin_comment")
        print(admin_comment)
        if user.role != "lab_admin":
            return Response({"error": "Not authorized to comment on a lab report"}, status=status.HTTP_403_FORBIDDEN)

        try:
            test_result = LabTestResult.objects.get(pk=pk)
            if test_result.is_marked_finalized():
                return Response({"error":"Lab test result already finalized and cannot be modified"},status=status.HTTP_400_BAD_REQUEST)
            test_result.add_admin_comment(admin_comment)
            test_result.test_order.update_status("")
            return Response({"message": "Comment added successfully"}, status=status.HTTP_200_OK)
        except LabTestResult.DoesNotExist:
            return Response({"error": "Lab test result not found"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=["post"], url_path="mark_finalized")
    def mark_finalized(self, request, pk=None):
        user = self.request.user
        print(f"Received mark_finalized request for test ID: {pk}")  # Debugging print
        if user.role != "lab_admin":
            return Response({"error": "Not authorized to mark a lab report as finalized"}, status=status.HTTP_403_FORBIDDEN)

        try:
            test_result = LabTestResult.objects.get(pk=pk)
            if test_result.is_marked_finalized():
                return Response({"error":"Lab test result already finalized and cannot be modified"},status=status.HTTP_400_BAD_REQUEST)
            test_result.mark_finalized()
            return Response({"message": "Marked finalized successfully"}, status=status.HTTP_200_OK)
        except LabTestResult.DoesNotExist:
            return Response({"error": "Lab test result not found"}, status=status.HTTP_404_NOT_FOUND)
        