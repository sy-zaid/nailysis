# Generated by Django 5.1.4 on 2025-03-18 23:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0016_remove_appointment_unique_time_slot_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='appointment_datetime',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='status',
            field=models.CharField(choices=[('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled'), ('Rescheduled', 'Rescheduled'), ('No-Show', 'No-Show')], default='Scheduled', max_length=20),
        ),
    ]
