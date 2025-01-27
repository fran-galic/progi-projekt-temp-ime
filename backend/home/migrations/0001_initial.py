# Generated by Django 5.1.3 on 2025-01-20 17:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('src', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='ModelType',
            fields=[
                ('modelType_id', models.AutoField(primary_key=True, serialize=False)),
                ('modelTypeName', models.CharField(choices=[('Suv', 'Suv'), ('Limo', 'Limo'), ('Compact', 'Compact')], max_length=7)),
            ],
        ),
        migrations.CreateModel(
            name='Model',
            fields=[
                ('model_id', models.AutoField(primary_key=True, serialize=False)),
                ('noOfSeats', models.SmallIntegerField()),
                ('automatic', models.BooleanField()),
                ('fuelType', models.CharField(choices=[('G', 'Gas'), ('D', 'Diesel'), ('E', 'Electric')], max_length=1)),
                ('modelName', models.CharField(max_length=50)),
                ('makeName', models.CharField(max_length=50)),
                ('modelType', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='home.modeltype')),
            ],
            options={
                'unique_together': {('makeName', 'modelName')},
            },
        ),
        migrations.CreateModel(
            name='Rent',
            fields=[
                ('rent_id', models.AutoField(primary_key=True, serialize=False)),
                ('dateTimeRented', models.DateTimeField()),
                ('dateTimeReturned', models.DateTimeField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('dealer', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='src.dealership')),
                ('rentedLocation', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='rented_location', to='src.location')),
                ('rentoid', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='src.rentoid')),
                ('returnLocation', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='return_location', to='src.location')),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('review_id', models.AutoField(primary_key=True, serialize=False)),
                ('rating', models.SmallIntegerField(blank=True, default=None, null=True)),
                ('description', models.TextField(blank=True, default='')),
                ('reviewDate', models.DateField(blank=True, default=None, null=True)),
                ('rent', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='home.rent')),
            ],
        ),
        migrations.CreateModel(
            name='Vehicle',
            fields=[
                ('vehicle_id', models.AutoField(primary_key=True, serialize=False)),
                ('registration', models.CharField(max_length=20, unique=True)),
                ('timesRented', models.IntegerField(blank=True, default=0)),
                ('rating', models.FloatField(blank=True, default=None, null=True)),
                ('noOfReviews', models.IntegerField(blank=True, default=0)),
                ('isVisible', models.BooleanField(default=True)),
                ('dealer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.dealership')),
                ('location', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='src.location')),
                ('model', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='home.model')),
            ],
        ),
        migrations.AddField(
            model_name='rent',
            name='vehicle',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='home.vehicle'),
        ),
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('offer_id', models.AutoField(primary_key=True, serialize=False)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('rating', models.FloatField(blank=True, default=0, null=True)),
                ('noOfReviews', models.IntegerField(blank=True, default=0)),
                ('description', models.TextField(blank=True, default='')),
                ('image', models.ImageField(upload_to='offers')),
                ('dealer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.dealership')),
                ('model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.model')),
            ],
            options={
                'unique_together': {('model', 'dealer')},
            },
        ),
    ]
