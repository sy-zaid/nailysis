# Generated by Django 5.1.4 on 2025-03-19 20:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0020_delete_labtechnicianappointmentfee'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='technicianappointment',
            name='lab_tests',
        ),
    ]
