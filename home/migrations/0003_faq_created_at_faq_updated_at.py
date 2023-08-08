# Generated by Django 4.2.2 on 2023-07-05 10:10

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_faq'),
    ]

    operations = [
        migrations.AddField(
            model_name='faq',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='faq',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]