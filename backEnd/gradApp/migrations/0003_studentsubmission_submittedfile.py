# Generated by Django 4.1.13 on 2024-11-04 20:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gradApp', '0002_studentsubmission_question_or_topic_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentsubmission',
            name='submittedFile',
            field=models.FileField(blank=True, null=True, upload_to='uploads/'),
        ),
    ]
