# Generated by Django 5.1.3 on 2024-11-15 00:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('src', '0001_initial'),
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
                ('modelType', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='home.modeltype')),
            ],
            options={
                'unique_together': {('makeName', 'modelName')},
            },
        ),
        migrations.CreateModel(
            name='Vehicle',
            fields=[
                ('vehicle_id', models.AutoField(primary_key=True, serialize=False)),
                ('registration', models.CharField(max_length=20, unique=True)),
                ('insured', models.BooleanField(blank=True, default=None, null=True)),
                ('yearOfCreation', models.IntegerField(blank=True, default=None, null=True)),
                ('timesRented', models.IntegerField(blank=True, default=0)),
                ('dealer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.dealership')),
                ('location', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='src.location')),
                ('model', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='home.model')),
            ],
        ),
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('offer_id', models.AutoField(primary_key=True, serialize=False)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('rating', models.FloatField(blank=True, default=None, null=True)),
                ('noOfReviews', models.IntegerField(blank=True, default=0)),
                ('description', models.TextField(blank=True, default='')),
                ('image', models.BinaryField(default=b'')),
                ('dealer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='src.dealership')),
                ('model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.model')),
            ],
            options={
                'unique_together': {('model', 'dealer')},
            },
        ),
    ]
