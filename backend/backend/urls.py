"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.conf import settings
from django.conf.urls.static import static

from src import urls, views

urlpatterns = [
    path("api/auth/", include("src.urls")),
    path("api/home/", include("home.urls")),
    path("api/profile/", include("profiles.urls")),
    path("accounts/", include("allauth.urls")),
    path("api/wallet/", include("wallet.urls")),
    path("admin/", admin.site.urls),
    path(
        "api/schema/", SpectacularAPIView.as_view(), name="schema"
    ),  # Do not use this path
    path(
        "api/schema/docs", SpectacularSwaggerView.as_view(url_name="schema")
    ),  # Use this one instead
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
