# Generated by Django 4.2.2 on 2023-07-05 11:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_faq_created_at_faq_updated_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(max_length=256)),
                ('user_email', models.CharField(max_length=300)),
                ('subject', models.CharField(max_length=500)),
                ('message', models.TextField()),
                ('message_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
