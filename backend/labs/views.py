from django.shortcuts import render

from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied

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
    queryset = LabTestOrder.objects.all()
    serializer_class = LabTestOrderSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        user = self.request.user
        # if user.role not in ["lab_technician","lab_admin"]:
        #     return Response({"error":"Not authorized to view test orders"})
        test_order_id = self.request.query_params.get("id")
        if test_order_id:
            return LabTestOrder.objects.filter(id=test_order_id)
        return LabTestOrder.objects.all()
    
    

class LabTestResultModelViewSet(viewsets.ModelViewSet):
    queryset = LabTestResult.objects.all()
    serializer_class = LabTestResultSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # user = self.request.user
        # if user.role not in ["lab_technician","lab_admin"]:
        #     raise PermissionDenied("Not authorized to view test results.")
        test_order_id = self.request.query_params.get("test_order_id")
        # Return objects for test order if a test order id is given in API
        if test_order_id:
            return LabTestResult.objects.filter(test_order_id=test_order_id)
        
        return LabTestResult.objects.all()
        
    @action(detail=False, methods=["post"], url_path="save_results")
    def save_results(self, request):
        user = self.request.user
        
        # Ensure only lab technicians can create test results
        if user.role != "lab_technician":
            return Response({"error": "User not authorized to create test report"}, status=status.HTTP_403_FORBIDDEN)

        # Extract and validate required fields
        test_order_id = request.data.get("test_order_id")
        technician_id = request.data.get("technician_id")
        test_entries = request.data.get("test_entries", "[]")  # Default to an empty JSON array
        comments = request.data.get("comments", "")

        if not test_order_id or not technician_id:
            return Response({"error": "test_order_id and technician_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert test_entries to JSON if it's a string
            if isinstance(test_entries, str):
                test_entries = json.loads(test_entries)

            # Fetch related objects
            test_order = get_object_or_404(LabTestOrder, id=test_order_id)
            lab_technician = get_object_or_404(LabTechnician, user_id=technician_id)
            test_type = get_object_or_404(LabTestType,id=2) # NEEDS TO BE CHANGED, TEMP

            # Create test result
            test_result = LabTestResult.objects.create(
                test_order=test_order,
                test_type=test_type,
                numeric_results=test_entries,
                comments=comments,
                reviewed_by=lab_technician
            )

            return Response(
                {
                    "message": "Test result saved successfully",
                    "test_result_id": test_result.id,
                    "test_order_id": test_order.id,
                    "reviewed_by": lab_technician.user_id
                },
                status=status.HTTP_201_CREATED
            )

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format for test_entries"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
