# Generated by Django 4.2.3 on 2023-08-07 06:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0019_alter_project_duration_alter_project_estimated_hours'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='duration',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='project',
            name='estimated_hours',
            field=models.CharField(max_length=265),
        ),
    ]