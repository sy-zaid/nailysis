# Generated by Django 5.1.4 on 2025-02-15 19:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('appointment_id', models.AutoField(primary_key=True, serialize=False)),
                ('appointment_date', models.DateField()),
                ('appointment_time', models.TimeField()),
                ('status', models.CharField(choices=[('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled'), ('Rescheduled', 'Rescheduled')], default='Scheduled', max_length=20)),
                ('reminder_sent', models.BooleanField(default=False)),
                ('notes', models.TextField(blank=True, null=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appointments', to='users.patient')),
            ],
        ),
        migrations.CreateModel(
            name='DoctorAppointmentFee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('appointment_type', models.CharField(choices=[('Consultation', 'Consultation'), ('Follow-up', 'Follow-up'), ('Routine Checkup', 'Routine Checkup'), ('Emergency Visit', 'Emergency Visit'), ('Prescription Refill', 'Prescription Refill')], max_length=50, unique=True)),
                ('fee', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='LabTechnicianAppointmentFee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='DoctorAppointment',
            fields=[
                ('appointment_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='appointments.appointment')),
                ('appointment_type', models.CharField(max_length=50)),
                ('specialization', models.CharField(max_length=100)),
                ('follow_up', models.BooleanField(default=False)),
                ('fee', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='doctor_appointments', to='users.doctor')),
            ],
            bases=('appointments.appointment',),
        ),
        migrations.CreateModel(
            name='TechnicianAppointment',
            fields=[
                ('appointment_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='appointments.appointment')),
                ('lab_test_id', models.IntegerField()),
                ('test_type', models.CharField(max_length=100)),
                ('test_status', models.CharField(default='Pending', max_length=50)),
                ('results_available', models.BooleanField(default=False)),
                ('lab_technician', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='technician_appointments', to='users.labtechnician')),
            ],
            bases=('appointments.appointment',),
        ),
        migrations.CreateModel(
            name='CancellationRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reason', models.TextField()),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending', max_length=10)),
                ('requested_at', models.DateTimeField(auto_now_add=True)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cancellation_requests', to='users.doctor')),
                ('reviewed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.clinicadmin')),
                ('appointment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cancellation_requests', to='appointments.doctorappointment')),
            ],
            options={
                'constraints': [models.UniqueConstraint(fields=('appointment',), name='unique_cancellation_request_per_appointment')],
            },
        ),
    ]
