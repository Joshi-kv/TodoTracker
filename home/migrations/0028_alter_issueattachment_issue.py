# Generated by Django 4.2.3 on 2023-08-11 04:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0027_issueattachment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='issueattachment',
            name='issue',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.issue'),
        ),
    ]
