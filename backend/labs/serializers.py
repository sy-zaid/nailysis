from rest_framework import serializers
from .models import LabTestType, LabTestOrder

class LabTestTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestType
        fields = "__all__"

class LabTestOrderSerializer(serializers.ModelSerializer):
    test_types = LabTestTypeSerializer(many=True, read_only=True)
    lab_technician_appointment = serializers.SerializerMethodField()

    class Meta:
        model = LabTestOrder
        fields = "__all__"

    def get_lab_technician_appointment(self, obj):
        """Function made to solve circular imports and send appointment data through API."""
        from appointments.models import TechnicianAppointment  # Import model directly (not serializer)

        if obj.lab_technician_appointment:
            appointment = obj.lab_technician_appointment
            return {
                "id": appointment.appointment_id,
                "patient_name": appointment.patient.user.first_name + " " + appointment.patient.user.last_name,  # Example
                "technician_name": appointment.lab_technician.user.first_name + " " + appointment.lab_technician.user.last_name,  # Example
                "checkout_datetime": appointment.checkout_datetime,
                "status": appointment.status,
                "fee": appointment.fee,
                "notes": appointment.notes,
            }
        return None
