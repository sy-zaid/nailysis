# Generated by Django 5.1.4 on 2025-03-17 21:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_role', models.CharField(choices=[('Patient', 'Patient'), ('Doctor', 'Doctor'), ('Lab_Technician', 'Lab_Technician')], max_length=20)),
                ('category', models.CharField(choices=[('Doctor Service', 'Doctor Service'), ('Appointment Issue', 'Appointment Issue'), ('Billing & Payments', 'Billing & Payments'), ('Lab Test Accuracy', 'Lab Test Accuracy'), ('Facilities & Cleanliness', 'Facilities & Cleanliness'), ('Technical Issue', 'Technical Issue'), ('Suggestions and Improvements', 'Suggestions and Improvements')], max_length=50)),
                ('description', models.TextField(blank=True, null=True)),
                ('date_submitted', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Resolved', 'Resolved')], default='Pending', max_length=10)),
                ('is_clinic_feedback', models.BooleanField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FeedbackResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('response_text', models.TextField()),
                ('date_submitted', models.DateTimeField(auto_now_add=True)),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('feedback', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='response', to='feedbacks.feedback')),
            ],
        ),
    ]
