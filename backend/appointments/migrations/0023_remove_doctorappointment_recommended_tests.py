# Generated by Django 5.1.4 on 2025-04-14 04:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0022_remove_appointment_appointment_date_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='doctorappointment',
            name='recommended_tests',
        ),
    ]
