# users/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.users_list, name='users_list'),
    path('<int:pk>/', views.users_detail, name='users_detail'),
    path('<int:user_id>/status_updates/', views.user_status_updates, name='user_status_updates'),
    path('<int:user_id>/notifications/', views.user_notifications, name='user_notifications'),
    path('notifications/<int:notification_id>/mark_as_read/', views.mark_notification_as_read, name='mark_notification_as_read'),
    path('register/', views.register_user, name='register_user'), # Add this line
]
