from django.contrib import admin
from .models import *

admin.site.register(
    [ModelType, Model, Offer, Vehicle, Rent, Review]
)
