from django.contrib import admin
from django.urls import path, include
from users import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include('courses.urls')), # Include courses urls
    path('api/users/', views.users_list, name='users_list'),
    path('api/users/<int:pk>/', views.users_detail, name='users_detail'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', views.register_user, name='register_user'),
    path('api/users/<int:user_id>/status_updates/', views.user_status_updates, name='user_status_updates'),
]
