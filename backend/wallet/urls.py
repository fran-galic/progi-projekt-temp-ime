from django.urls import path
from django.contrib import admin
from django.urls import path, include
from . import views


app_name = "wallet"
urlpatterns = [
    path("getBalance/<rentoid_id>/", views.getBalance, name="getBalance"),
    path("addMoney/<rentoid_id>/", views.addMoney, name="addMoney"),
    path("removeMoney/<rentoid_id>/", views.removeMoney, name="removeMoney"),
    path("rentOffer/<offer_id>/", views.Rent, name="removeMoney"),
]
