from appointments.models import Appointment,DoctorAppointment,TechnicianAppointment
from rest_framework import serializers
from users.models import Doctor
from users.serializers import PatientSerializer,DoctorSerializer,LabTechnicianSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    class Meta:
        model = Appointment
        fields = '__all__'  # Ensure fields match frontend keys


class DoctorAppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = DoctorAppointment
        fields = "__all__"
        read_only_fields = ('appointment_id',)  # Exclude appointment_id during creation

    def create(self, validated_data):
        # Access the request object from the context
        request = self.context.get('request')

        # Get the patient and doctor objects from the request data
        patient = request.user.patient  # Assuming patient is related to the user
        doctor_id = request.data.get('doctor')
        doctor = Doctor.objects.get(user__id=doctor_id)

        return DoctorAppointment.objects.create(
            patient=patient, doctor=doctor, **validated_data
        )
        
class TechnicianAppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    technician = LabTechnicianSerializer()
    class Meta:
        model = TechnicianAppointment
        fields = "__all__"