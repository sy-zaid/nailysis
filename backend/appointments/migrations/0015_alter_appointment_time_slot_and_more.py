# Generated by Django 5.1.4 on 2025-03-15 23:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0014_alter_appointment_time_slot'),
        ('users', '0002_remove_patient_medical_history'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='time_slot',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='appointments.timeslot'),
        ),
        migrations.AddConstraint(
            model_name='appointment',
            constraint=models.UniqueConstraint(fields=('time_slot',), name='unique_time_slot'),
        ),
    ]
