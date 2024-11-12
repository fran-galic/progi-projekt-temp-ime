# Generated by Django 5.1.3 on 2024-11-12 15:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_remove_offer_picture_offer_picturepath'),
    ]

    operations = [
        migrations.AlterField(
            model_name='modeltype',
            name='modelTypeName',
            field=models.CharField(choices=[('Suv', 'Suv'), ('Limo', 'Limo'), ('Compact', 'Compact')], max_length=7),
        ),
        migrations.AlterField(
            model_name='offer',
            name='picturePath',
            field=models.CharField(default='', max_length=200),
        ),
    ]
