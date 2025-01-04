from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.mail import EmailMessage
from django.contrib.auth.models import User
from django.db.models import Max
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.contrib.auth import logout, authenticate, login, get_user_model
from .models import *
import json
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from .forms import NewUserForm, NewCompanyForm
from .tokens import account_activation_token
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse, OpenApiExample
import base64

def activate(request, uidb64, token):
    User = get_user_model()
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return HttpResponse("Email confirmed!")
    return HttpResponse("Email confirmation failed!")


def activateEmail(request, user, toEmail):
    subject = "Activate EasyRent account"
    message = render_to_string(
        "templateActivateAccount.html",
        {
            "domain": get_current_site(request).domain,
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
            "protocol": "https" if request.is_secure() else "http",
        },
    )
    email = EmailMessage(subject, message, to=[toEmail])

    try:
        email.send()
        print("Email sent!")
        return 1
    except Exception as e:
        print("Sending failed!", e)
        return 0


@csrf_exempt
@extend_schema(tags=['auth'])
@api_view(['POST'])
def registerUser(request):
    try:
        data = json.loads(request.body)
        email = data.get("email")
        username = "user_" + email
        firstName = data.get("firstName")
        lastName = data.get("lastName")
        driversLicense = data.get("driversLicense")
        phoneNo = data.get("phoneNo")
        password = data.get("password")
        confirmPassword = data.get("confirmPassword")

        if (
            not email
            or not firstName
            or not lastName
            or not phoneNo
            or not password
            or not confirmPassword
            or not driversLicense
        ):
            return JsonResponse({"message": "All fields are required."}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {"message": "Email already registered."}, status=400
            )
        if password != confirmPassword:
            return JsonResponse({"message: Passwords do not match."}, status=400)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=firstName,
            last_name=lastName,
        )
        user.is_active = False
        user.save()
        rentoid = Rentoid.objects.create(
            user=user, phoneNo=phoneNo, driversLicenseNo=driversLicense
        )
        if activateEmail(request, user, email):
            return JsonResponse({"success": 1}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({"message": "Invalid JSON"}, status=400)


@csrf_exempt
@extend_schema(
    methods=['POST'],
    operation_id='register_company',
    tags=['auth'],
    request=RegisterCompanySerializer,
    responses={
        200: OpenApiResponse(
            description='Email confirmation request sent',
            examples=[
                OpenApiExample(
                    'Email confirmation request sent',
                    value={"success": 1, "message": "Email confirmation request sent"},
                ),
            ],
        ),
        400: OpenApiResponse(
            description='All fields are required or Email already registered',
            examples=[
                OpenApiExample(
                    'All fields are required',
                    value={"success": 0, "message": "All fields are required."},
                ),
                OpenApiExample(
                    'Email already registered',
                    value={"success": 0, "message": "Email already registered."},
                ),
            ],
        ),
    },
)
@api_view(['POST'])
def registerCompany(request):
    data = json.loads(request.body)
    email = data.get("email")
    companyName = data.get("name")
    tin = data.get("TIN")
    phoneNo = data.get("phoneNo")
    countryName = data.get("countryName")
    cityName = data.get("cityName")
    streetName = data.get("streetName")
    streetNo = data.get("streetNo")
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    workingHours = data.get("workingHours")
    description = data.get("description")
    password = data.get("password")

    if (
        not email
        or not companyName
        or not tin
        or not phoneNo
        or not countryName
        or not cityName
        or not streetName
        or not streetNo
        or not latitude
        or not longitude
        or not workingHours
        or not description
        or not password
    ):
        return JsonResponse({"success": 0, "message": "All fields are required."}, status=400)
    if User.objects.filter(email=email).exists():
        return JsonResponse({"success": 0, "message": "Email already registered."}, status=400)
    if len(phoneNo) > 20:
        return JsonResponse({"success": 0, "message": "Phone number too long."}, status=400)
    if len(tin) > 16:
        return JsonResponse({"success": 0, "message": "TIN too long."}, status=400)
    
    try:
        workingHours = json.loads(workingHours)
        if not isinstance(workingHours, list):
            return JsonResponse({"success": 0, "message": "Working hours must be a list."}, status=400)
        valid_days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"}
        for day_info in workingHours:
            if not isinstance(day_info, dict):
                return JsonResponse({"success": 0, "message": "Each working hour entry must be a dictionary."}, status=400)
            day = day_info.get("day")
            start_time = day_info.get("startTime")
            end_time = day_info.get("endTime")
            if day not in valid_days:
                return JsonResponse({"success": 0, "message": f"Invalid day: {day}"}, status=400)
            if not start_time or not end_time:
                return JsonResponse({"success": 0, "message": "Start time and end time are required."}, status=400)
            if start_time >= end_time:
                return JsonResponse({"success": 0, "message": "End time must be after start time."}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({"success": 0, "message": "Invalid JSON for working hours."}, status=400)

    user = User.objects.create_user(
        username="company_" + email,
        email=email,
        password=password,
        first_name=companyName,
        last_name="",
    )
    user.is_active = False  # User must confirm email
    user.save()
    dealership = Dealership.objects.create(user=user, phoneNo=phoneNo, TIN=tin, description=description)

    if activateEmail(request, user, email):
        return JsonResponse({"success": 1, "message": "Email confirmation request sent"}, status=200)


@csrf_exempt
@extend_schema(tags=['auth'])
@api_view(['POST'])
def logoutUser(request):
    logout(request)
    return JsonResponse({"success": 1}, status=200)


@csrf_exempt
@extend_schema(tags=['auth'])
@api_view(['POST'])
def loginUser(request):
    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return JsonResponse({"message": "All fields are required."}, status=400)
    try:
        user = User.objects.get(email=email)
        if not user.is_active:
            return JsonResponse(
                {"message:": "Awaiting email confirmation"}, status=403
            )
        username = user.username
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            role = None
            balance = None
            firstName = None
            try:
                # Try to find rentoid
                rentoid = Rentoid.objects.get(user=user.id)
                role = "user"
                balance = rentoid.balance
                firstName = user.first_name
            except Rentoid.DoesNotExist:
                # If Rentoid does not exist, try to find the Dealership
                try:
                    dealership = Dealership.objects.get(user=user.id)
                    role = "company"
                except Dealership.DoesNotExist:
                    # If neither exists return none
                    return JsonResponse(
                        {
                            "message": "Something has gone horribly wrong on our side!"
                        },
                        status=500,
                    )
            return JsonResponse(
                {
                    "success": 1,
                    "role": role,
                    "firstName": firstName,
                    "balance": balance,
                },
                status=200,
            )
        else:
            return JsonResponse({"success": 0}, status=400)
    except User.DoesNotExist:
        return JsonResponse({"message": "Invalid credentials"}, status=400)


def redirectHome(request):
    return redirect("http://localhost:3000/home")
