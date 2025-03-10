# backend/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from users import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve  # Import the serve functio

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include('courses.urls')), # Include courses urls
    path('api/users/', include('users.urls')), # Include users urls
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
