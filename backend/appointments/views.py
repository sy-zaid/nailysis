"""
views.py - Handles API endpoints for appointments, doctor fees, 
and cancellation requests in the Nailysis system.

This module contains Django REST Framework ViewSets for managing:
- Doctor fees
- Doctor appointments
- Lab technician appointments
- Appointment cancellations

Each ViewSet includes appropriate permission handling, custom actions,
and data validation.
"""

from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import (
    Appointment, DoctorAppointment, TechnicianAppointment,
    DoctorAppointmentFee, CancellationRequest,TimeSlot
)
from .serializers import (
    AppointmentSerializer, DoctorAppointmentSerializer, TimeSlotSerializer,
    TechnicianAppointmentSerializer, DoctorFeeSerializer, CancellationRequestSerializer
)   
from users.models import Patient, Doctor, ClinicAdmin, CustomUser, LabTechnician, LabAdmin
from labs.models import LabTestOrder,LabTestType
from datetime import datetime, timedelta
import calendar

class DoctorFeeViewset(viewsets.ModelViewSet):
    """
    API endpoint to manage doctor appointment fees.

    Features:
    - Retrieve a list of all doctor appointment fees.
    - Perform standard CRUD operations on doctor fees.

    Permissions:
    - Only authenticated users can access doctor's fees.

    Endpoints:
    ----------
    - `GET /doctorfees/` : Retrieves all doctor fees.
    - `POST /doctorfees/` : Creates a new doctor fee entry.
    - `PUT /doctorfees/{id}/` : Updates an existing fee.
    - `DELETE /doctorfees/{id}/` : Deletes a doctor fee entry.
    - `GET /doctorfees/get_fees/` : Returns all doctor fees in JSON format.

    Notes:
    ------
    - Currently, there are no role-based restrictions on modifying fees.
    - Consider restricting access to only clinic admins for security.
    """

    queryset = DoctorAppointmentFee.objects.all()
    serializer_class = DoctorFeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='get_fees')
    def get_fees(self,request):
        """
        Retrieve all appointment fees for display.
        
        Returns:
            JSON response containing the list of doctor fees.
        """
        fees = DoctorAppointmentFee.objects.all()
        serializer = self.get_serializer(fees, many=True)
        return Response(serializer.data)


class DoctorAppointmentViewset(viewsets.ModelViewSet):
    """
    API endpoint for managing doctor appointments.

    Features:
    - View appointments based on user role
    - Book new doctor appointments
    - Cancel and reschedule appointments
    - Mark appointments as complete and save EHR data

    Permissions:
    - Only authenticated users can access this viewset.
    - Patients can view, book, and cancel their own appointments.
    - Doctors can view their own appointments, request cancellations, and mark appointments as complete.
    - Clinic admins have full access to all appointments and can book, reschedule, and cancel appointments.

    Notes:
    ------
    - The system verifies user roles before allowing access to certain actions.
    - Clinic admins have the highest level of access for appointment management.
    - Doctors can only request cancellations, not directly cancel appointments.
    """
    queryset = DoctorAppointment.objects.all()
    serializer_class = DoctorAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retrieve appointments based on user role:
        - Patients see only their own appointments.
        - Doctors see only their own appointments.
        - Clinic admins see all appointments.
        """
        user = self.request.user

        if user.role == "patient":
            try:
                patient = Patient.objects.get(user=user)
                return DoctorAppointment.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return DoctorAppointment.objects.none()

        elif user.role == "clinic_admin":
            return DoctorAppointment.objects.all()

        elif user.role == "doctor":
            try:
                doctor = Doctor.objects.get(user=user)
                return DoctorAppointment.objects.filter(doctor=doctor)
            except Doctor.DoesNotExist:
                return DoctorAppointment.objects.none()

        return DoctorAppointment.objects.none()

    def perform_destroy(self, instance):
        """
        Ensure only clinic admins can delete an appointment.
        """
        user = self.request.user
        if user.role == "clinic_admin":
            instance.delete()
        else:
            return Response({"error":"You are not authorized to delete this appointment."},status=status.HTTP_403_FORBIDDEN)
        return Response({"message":"Successfully deleted appointment"}, status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        """
        Handles rescheduling of doctor appointments via a modified PUT request.

        Restrictions:
        - Only clinic admins have permission to update appointment details.
        - Unauthorized users will receive a 403 Forbidden response.

        Process:
        - The frontend sends a PUT request with the updated appointment details.
        - The system verifies if the requester is a clinic admin.
        - If authorized, the appointment details are updated, and the status is set to 'Rescheduled'.

        Returns:
        - A success response upon successful rescheduling.
        - A 403 Forbidden response if the user lacks authorization.
        """
        user = self.request.user
        if user.role != "clinic_admin":
            return Response({"error": "Not authorized!"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)
        
    @action(detail=False, methods=['post'], url_path='book_appointment')
    def book_appointment(self, request):
        """
        Handles booking of a new doctor appointment.

        Restrictions:
        - Only patients and clinic admins can book an appointment.
        - Unauthorized users will receive a 403 Forbidden response.

        Process:
        - The frontend sends a POST request with required appointment details.
        - The system verifies if the requester is a patient or clinic admin.
        - If the user is a patient, their existing profile is used.
        - If the user is a clinic admin:
        - They can book an appointment for a walk-in patient.
        - If a patient email is provided, the system retrieves the existing patient.
        - Otherwise, a new walk-in patient account is created.
        - The appointment is created and saved in the system.

        Expected Request Data:
        - `doctor_id` (ID of the doctor)
        - `appointment_date` (Date of the appointment)
        - `start_time` (Start time of the appointment)
        - `appointment_type` (Type of appointment)
        - `specialization` (Specialization for the appointment)
        - `fee` (Appointment fee)
        - `patient_email` (Optional, used by clinic admins when booking for an existing patient)

        Returns:
        - A success response with the appointment ID upon successful booking.
        - A 403 Forbidden response if the user is unauthorized.
        """
        doctor_id = request.data.get('doctor_id')
        slot_id = request.data.get('slot_id')
        appointment_type = request.data.get('appointment_type')
        fee = request.data.get('fee')
        notes = request.data.get('notes')
        patient_email = request.data.get("patient_email")

        user = self.request.user
        doctor = get_object_or_404(Doctor, user_id=doctor_id)
        time_slot = get_object_or_404(TimeSlot,id=slot_id)
        
        if user.role == "clinic_admin":
            if not patient_email:
                patient = CustomUser.create_walkin_account(**request.data)
            else:
                patient = get_object_or_404(Patient, user__email=patient_email)
        elif user.role == "patient":
            patient = get_object_or_404(Patient, user=request.user)
        else:
            return Response({"error": "You are not authorized to book a doctor appointment"}, status=status.HTTP_403_FORBIDDEN)

        conflict_exists = TechnicianAppointment.objects.filter(
            patient=patient,
            time_slot__start_time=time_slot.start_time
        ).exists()

        if conflict_exists:
            return Response(
                {"error": "A lab appointment exists at this time slot."},
                status=status.HTTP_409_CONFLICT
            )

        doctor_appointment = DoctorAppointment.objects.create(
            patient=patient,
            doctor=doctor,
            time_slot = time_slot,
            appointment_type=appointment_type,
            fee=fee,
            notes = notes
        )
        if time_slot.is_booked == False:
            time_slot.is_booked = True
        else:
            return Response({"error":"Time slot already occupied for other appointment"},status=status.HTTP_409_CONFLICT)
        time_slot.save()
        
        return Response({
            "message": "Appointment booked successfully",
            "appointment_id": doctor_appointment.appointment_id
        })

    @action(detail=True, methods=["post"], url_path="cancel_appointment")
    def cancel_appointment(self, request, pk=None):
        """
        Cancel an existing doctor appointment.

        Restrictions:
        - Only patients and clinic admins are allowed to cancel appointments.
        - Doctors are not authorized to perform this action.

        Process:
        - The user must send a POST request to cancel an appointment.
        - The system verifies the user's role.
        - If authorized, the appointment is retrieved and marked as canceled.

        Returns:
        - 200 OK: If the appointment is successfully canceled.
        - 403 Forbidden: If the user lacks the necessary permissions.
        - 404 Not Found: If the specified appointment does not exist.
        """
        user = request.user
        if user.role not in ["patient", "clinic_admin"]:
            return Response(
                {"error": "You are not authorized to cancel doctor appointment."},
                status=status.HTTP_403_FORBIDDEN
            )

        appointment = get_object_or_404(DoctorAppointment, pk=pk)
        appointment.cancel_appointment()

        return Response(
            {"message": "The appointment has been successfully canceled."},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=["post"], url_path="request_cancellation")
    def request_cancellation(self, request, pk=None):
        """
        Request the cancellation of a doctor appointment.

        Restrictions:
        - Only doctors can request appointment cancellations.
        - Other user roles attempting this action will receive a 403 Forbidden response.

        Process:
        - The doctor submits a POST request with a valid reason for cancellation.
        - The system verifies the doctor's identity and retrieves the corresponding appointment.
        - If found, a cancellation request is created with a "Pending" status.
        - The appointment status is also updated to "Pending" until further action is taken.

        Returns:
        - 201 Created: If the cancellation request is successfully submitted.
        - 400 Bad Request: If no cancellation reason is provided.
        - 403 Forbidden: If a non-doctor attempts this action.
        - 404 Not Found: If the doctor or appointment does not exist.
        """
        user = self.request.user
        if user.role != "doctor":
            return Response(
                {"error": "Only doctors can submit a cancellation request."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            doctor = Doctor.objects.get(user=user)
            appointment = DoctorAppointment.objects.get(pk=pk, doctor=doctor)
        except (Doctor.DoesNotExist, DoctorAppointment.DoesNotExist):
            return Response(
                {"error": "No matching appointment found."},
                status=status.HTTP_404_NOT_FOUND
            )

        reason = request.data.get("reason", "").strip()
        if not reason:
            return Response(
                {"error": "A valid cancellation reason is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cancellation_request = CancellationRequest.objects.create(
            doctor=doctor,
            appointment=appointment,
            reason=reason,
            status="Pending"
        )
        appointment.status = "Pending"
        appointment.save()

        return Response(
            {
                "message": "Cancellation request submitted successfully.",
                "request_id": cancellation_request.id
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'], url_path="complete_appointment_with_ehr")
    def complete_appointment_with_ehr(self, request, pk=None):
        """
        Mark an appointment as complete and save Electronic Health Record (EHR) data.

        Restrictions:
        - Only doctors are allowed to complete appointments.
        - Unauthorized users will receive a 403 Forbidden response.

        Process:
        - The doctor submits a POST request with EHR details.
        - JSON-encoded lists (medical conditions, medications, immunizations, diagnoses) are converted into Python lists.
        - Additional fields like comments, family history, and category are extracted.
        - The appointment is retrieved and marked as complete, updating the EHR data.

        Returns:
        - 200 OK: If the appointment is successfully completed with EHR data saved.
        - 403 Forbidden: If the user is not a doctor.
        - 404 Not Found: If the appointment does not exist.
        """
        import json

        user = self.request.user
        if user.role != "doctor":
            return Response(
                {"error": "Only doctors can mark an appointment as complete."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Convert JSON-encoded strings to lists if necessary
        medical_conditions = request.data.get("medical_conditions", "[]")
        current_medications = request.data.get("current_medications", "[]")
        immunization_records = request.data.get("immunization_records", "[]")
        diagnoses = request.data.get("diagnoses", "[]")
        recommended_lab_test = request.data.get("recommended_lab_test", "[]")

        # Ensure these fields are properly converted to lists
        if isinstance(medical_conditions, str):
            medical_conditions = json.loads(medical_conditions)
        if isinstance(current_medications, str):
            current_medications = json.loads(current_medications)
        if isinstance(immunization_records, str):
            immunization_records = json.loads(immunization_records)
        if isinstance(recommended_lab_test, str):
            recommended_lab_test = json.loads(recommended_lab_test)
        if isinstance(diagnoses, str):
            diagnoses = json.loads(diagnoses)

        comments = request.data.get("comments", "")
        family_history = request.data.get("family_history", "")
        category = request.data.get("category", "General")

        ehr_data = [category, medical_conditions, current_medications, immunization_records, diagnoses, comments, family_history,recommended_lab_test]
        print("EHRDATA",ehr_data)
        try:
            appointment = DoctorAppointment.objects.get(pk=pk)
            appointment.complete_appointment_with_ehr(ehr_data=ehr_data)
            return Response(
                {"message": "EHR data successfully saved. Appointment marked as complete."},
                status=status.HTTP_200_OK
            )
        except DoctorAppointment.DoesNotExist:
            return Response(
                {"error": "No matching appointment found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
class LabTechnicianAppointmentViewset(viewsets.ModelViewSet):
    """
    API endpoint for managing lab technician appointments.
    """
    queryset = TechnicianAppointment.objects.all()
    serializer_class = TechnicianAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retrieve appointments based on user role:
        - Patients see only their own appointments.
        - Technician see only their own appointments.
        - Lab Admins see all appointments.
        """
        user = self.request.user

        if user.role == "patient":
            try:
                patient = Patient.objects.get(user=user)
                return TechnicianAppointment.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return TechnicianAppointment.objects.none()

        elif user.role == "lab_admin":
            return TechnicianAppointment.objects.all()

        elif user.role == "lab_technician":
            try:
                lab_technician = LabTechnician.objects.get(user=user)
                return TechnicianAppointment.objects.filter(lab_technician=lab_technician)
            except LabTechnician.DoesNotExist:
                return TechnicianAppointment.objects.none()

        return TechnicianAppointment.objects.none()

    @action(detail=False, methods=['post'], url_path='book_appointment')
    def book_appointment(self, request):
        """
        Book a new lab appointment.
        """
        user = self.request.user

        lab_technician_id = request.data.get('lab_technician_id')
        patient_email = request.data.get('patient_email')
        requested_lab_tests = request.data.get('requested_lab_tests')
        slot_id = request.data.get('slot_id')
        fee = request.data.get('fee')
        notes = request.data.get('notes')
        
        lab_technician = get_object_or_404(LabTechnician, user_id=lab_technician_id)
        time_slot = get_object_or_404(TimeSlot,id=slot_id)
        
        # Handling patient information
        if user.role == "lab_admin":
            if not patient_email:
                patient = CustomUser.create_walkin_account(**request.data)
            else:
                patient = get_object_or_404(Patient, user__email=patient_email)
        elif user.role == "patient":
            patient = get_object_or_404(Patient, user=request.user)
        
        conflict_exists = DoctorAppointment.objects.filter(
            patient=patient,
            time_slot__start_time=time_slot.start_time
        ).exists()

        if conflict_exists:
            return Response(
                {"error": "A doctor appointment exists at this time slot."},
                status=status.HTTP_409_CONFLICT
            )
            
        lab_technician_appointment = TechnicianAppointment.objects.create(
            patient=patient,
            lab_technician=lab_technician,
            time_slot = time_slot,
            fee=fee,
            notes=notes
        )
        
        # Retrieve the selected LabTestType records using the requested IDs
        selected_tests = LabTestType.objects.filter(id__in=requested_lab_tests)

        # Create a LabTestOrder and link it to the TechnicianAppointment
        lab_test_order = LabTestOrder.objects.create(
            lab_technician_appointment=lab_technician_appointment
        )

        # Associate the selected LabTestType records with the order in a JUNCTION TABLE
        lab_test_order.test_types.set(selected_tests)  # ManyToMany field
        
        if time_slot.is_booked == False:
            time_slot.is_booked = True
        else:
            return Response({"error":"Time slot already occupied for other appointment"},status=status.HTTP_409_CONFLICT)
        time_slot.save()

        return Response({
            "message": "Lab appointment booked successfully",
            "appointment_id": lab_technician_appointment.appointment_id
        })
    
    @action(detail=True, methods=["post"], url_path="cancel_appointment")
    def cancel_appointment(self, request, pk=None):
        """
        Cancel a lab technician appointment.

        Only patients and lab admins are authorized to cancel appointments.
        """
        user = request.user
        if user.role not in ["patient", "lab_admin"]:
            return Response({"error": "Unauthorized action."}, status=status.HTTP_403_FORBIDDEN)

        appointment = get_object_or_404(TechnicianAppointment, pk=pk)
        appointment.cancel_appointment()
        return Response({"message": "Appointment cancelled successfully."}, status=status.HTTP_200_OK)
    
    @action(detail=True,methods=["post"],url_path='request_cancellation')
    def request_cancellation(self,request,pk=None):
        user = self.request.user
        if user.role != "lab_technician":
            return Response({"error":"Only lab technicians can generate a cancellation request"},status=status.HTTP_403_FORBIDDEN)
        
        try:
            lab_technician = LabTechnician.objects.get(user=user)
            appointment = TechnicianAppointment.objects.get(pk=pk,doctor=lab_technician)
        except(LabTechnician.DoesNotExist,TechnicianAppointment.DoesNotExist):
            return Response({"error":"No Appointment Found"},status=status.HTTP_404_NOT_FOUND)
        
        reason = request.data.get('reason','').strip()
        if not reason:
            return Response({"error":"Cancellation reason is required"},status=status.HTTP_400_BAD_REQUEST)
        cancellation_request = CancellationRequest.objects.create(lab_technician=lab_technician,appointment=appointment,reason = reason,status="Pending")
        appointment.status = "Pending"
        appointment.save()
        return Response({"message":"Cancellation request sent successfully","request_id":cancellation_request.id},status=status.HTTP_201_CREATED)    

    @action(detail=True, methods=["put"], url_path='reschedule_technician_appointment')
    def reschedule_technician_appointment(self, request, pk=None):
        """
        Reschedules a lab appointment by reallocating the time slot, updating details,
        and ensuring test orders are reset.
        """
        try:
            print("REQUESTS DATA TO RESC",request.data)
            lab_technician_appointment = get_object_or_404(TechnicianAppointment, appointment_id=pk)  # Appointment to be rescheduled
            
            lab_technician_id = request.data.get('lab_technician_id')
            requested_lab_tests = request.data.get('requested_lab_tests', [])
            slot_id = request.data.get('slot_id')
            fee = request.data.get('fee')
            
            # Validate Inputs
            if not slot_id:
                return Response({"error": "Time slot ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            if not lab_technician_id:
                return Response({"error": "Lab technician ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch Lab Technician and Time Slot
            lab_technician = get_object_or_404(LabTechnician, user_id=lab_technician_id)
            time_slot = get_object_or_404(TimeSlot, id=slot_id)

            # Check for conflicts with Doctor Appointments
            conflict_exists = DoctorAppointment.objects.filter(
                patient=lab_technician_appointment.patient,
                time_slot__start_time=time_slot.start_time
            ).exists()

            if conflict_exists:
                return Response(
                    {"error": "A doctor appointment exists at this time slot."},
                    status=status.HTTP_409_CONFLICT
                )

            # Reschedule Time Slot
            if not lab_technician_appointment.reschedule_time_slot(slot_id):
                return Response(
                    {"error": "Rescheduling failed. The slot might be unavailable."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update Lab Technician and Fee
            lab_technician_appointment.lab_technician = lab_technician
            lab_technician_appointment.fee = fee
            lab_technician_appointment.save()

            # Delete Previous LabTestOrder
            LabTestOrder.objects.filter(lab_technician_appointment=lab_technician_appointment).delete()

            # Retrieve the selected LabTestType records using the requested IDs
            selected_tests = LabTestType.objects.filter(id__in=requested_lab_tests)

            # Create a New LabTestOrder
            lab_test_order = LabTestOrder.objects.create(
                lab_technician_appointment=lab_technician_appointment
            )
            lab_test_order.test_types.set(selected_tests)  # ManyToMany field

            return Response({
                "message": "Lab appointment rescheduled successfully",
                "appointment_id": lab_technician_appointment.appointment_id
            })

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path="complete_appointment")
    def complete_appointment(self, request, pk=None):
        user = request.user
        
        if user.role != "lab_technician":
            return Response({"error": "Not authorized to complete a technician's appointment"}, status=status.HTTP_403_FORBIDDEN)
        
        appointment = get_object_or_404(TechnicianAppointment, pk=pk)
        
        if appointment.status == "Completed":
            return Response({"error": "Appointment is already completed"}, status=status.HTTP_400_BAD_REQUEST)

        success = appointment.mark_completed()
        
        if success:
            return Response({"message": "Successfully completed appointment and deleted timeslot"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Could not complete the appointment"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        
class DocAppointCancellationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for handling doctor appointment cancellation requests.
    """
    queryset = CancellationRequest.objects.all()
    serializer_class = CancellationRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Allow only clinic admins to view all cancellation requests.
        """
        user = self.request.user
        if user.role == "clinic_admin":
            return CancellationRequest.objects.all()
        return CancellationRequest.objects.none()

    @action(detail=True, methods=['post'], url_path='review')
    def review_request(self, request, pk):
        """
        Allow clinic admins to approve or reject cancellation requests.
        """
        user = self.request.user
        if user.role != "clinic_admin":
            return Response({"error": "Only admins can review requests."}, status=status.HTTP_403_FORBIDDEN)

        cancellation_request = get_object_or_404(CancellationRequest, pk=pk, status="Pending")
        action = request.data.get("action", "").lower()

        if action not in ["approve", "reject"]:
            return Response({"error": "Invalid action. Use 'approve' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)

        cancellation_request.status = "Approved" if action == "approve" else "Rejected"
        cancellation_request.save()

        if action == "approve":
            cancellation_request.appointment.cancel_appointment()

        return Response({"message": f"Cancellation request {action}d successfully."})
    

class LabTechnicianAppointCancellationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for handling lab technician appointment cancellation requests.
    """
    queryset = CancellationRequest.objects.all()
    serializer_class = CancellationRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Allow only lab admins to view all cancellation requests.
        """
        user = self.request.user
        if user.role == "lab_admin":
            return CancellationRequest.objects.all()
        return CancellationRequest.objects.none()

    @action(detail=True, methods=['post'], url_path='review')
    def review_request(self, request, pk):
        """
        Allow lab admins to approve or reject cancellation requests.
        """
        user = self.request.user
        if user.role != "lab_admin":
            return Response({"error": "Only admins can review requests."}, status=status.HTTP_403_FORBIDDEN)

        cancellation_request = get_object_or_404(CancellationRequest, pk=pk, status="Pending")
        action = request.data.get("action", "").lower()

        if action not in ["approve", "reject"]:
            return Response({"error": "Invalid action. Use 'approve' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)

        cancellation_request.status = "Approved" if action == "approve" else "Rejected"
        cancellation_request.save()

        if action == "approve":
            cancellation_request.appointment.cancel_appointment()

        return Response({"message": f"Cancellation request {action}d successfully."})    



class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        doctor_id = self.request.query_params.get('doctor_id')
        technician_id = self.request.query_params.get('lab_technician_id')
        date = self.request.query_params.get('date')

        queryset = TimeSlot.objects.filter(is_booked=False)  # Only booked slots

        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if technician_id:
            queryset = queryset.filter(lab_technician_id=technician_id)
        if date:
            queryset = queryset.filter(slot_date=date)
        return queryset


    def create(self, request, *args, **kwargs):
        """
        Create multiple slots for a doctor or a lab technician over a date range.
        Expected request format:
        {
            "doctor_id": 1,   # OR "lab_tech_id": 2
            "start_date": "2025-03-12",
            "end_date": "2025-03-18",
            "time_slots": [
                {"start_time": "09:00", "end_time": "09:30"},
                {"start_time": "10:00", "end_time": "10:30"}
            ],
            "working_days": ["Monday", "Wednesday", "Friday"]
        }
        """

        user = request.user
        if user.role not in ["doctor", "lab_technician"]:
            return Response({"error": "Not authorized to create availability slots"}, status=status.HTTP_403_FORBIDDEN)

        doctor_id = request.data.get("doctor_id")
        lab_tech_id = request.data.get("lab_tech_id")
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")
        time_slots = request.data.get("time_slots", [])
        working_days = request.data.get("working_days", [])

        # Ensure either doctor_id or lab_tech_id is provided
        if not doctor_id and not lab_tech_id:
            return Response({"error": "Either doctor_id or lab_tech_id must be provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate required fields
        if not all([start_date, end_date, time_slots, working_days]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate working_days format
        if not isinstance(working_days, list) or any(day not in calendar.day_name for day in working_days):
            return Response({"error": "Invalid format for working_days"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch doctor or lab technician instance
        user_instance = None
        if doctor_id:
            try:
                user_instance = Doctor.objects.get(user_id=doctor_id)
            except Doctor.DoesNotExist:
                return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        elif lab_tech_id:
            try:
                user_instance = LabTechnician.objects.get(user_id=lab_tech_id)
            except LabTechnician.DoesNotExist:
                return Response({"error": "Lab Technician not found"}, status=status.HTTP_404_NOT_FOUND)

        # Validate date format
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format, use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

        if start_date > end_date:
            return Response({"error": "Start date must be before end date"}, status=status.HTTP_400_BAD_REQUEST)

        slots_to_create = []
        current_date = start_date

        while current_date <= end_date:
            day_name = calendar.day_name[current_date.weekday()]  # Get day name (e.g., 'Monday')
            if day_name in working_days:  # Only create slots for working days

                # 🔹 Delete previous slots for this date before creating new ones
                TimeSlot.objects.filter(
                    slot_date=current_date,
                    doctor=user_instance if doctor_id else None,
                    lab_technician=user_instance if lab_tech_id else None,
                ).delete()

                # 🔹 Create new slots
                for slot in time_slots:
                    slots_to_create.append(TimeSlot(
                        doctor=user_instance if doctor_id else None,
                        lab_technician=user_instance if lab_tech_id else None,
                        slot_date=current_date,
                        start_time=slot["start_time"],
                        end_time=slot["end_time"],
                        is_booked=False
                    ))

            current_date += timedelta(days=1)  # Move to the next day

        # Bulk create time slots
        if slots_to_create:
            TimeSlot.objects.bulk_create(slots_to_create)
            return Response({"message": "Slots created successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "No slots created, check working days"}, status=status.HTTP_400_BAD_REQUEST)

