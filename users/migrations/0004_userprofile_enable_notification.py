# Generated by Django 4.2.2 on 2023-07-13 10:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_rename_phone_userprofile_phone_number_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='enable_notification',
            field=models.BooleanField(default=True),
        ),
    ]
