# users/views.py
from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import User, StatusUpdate, Notification
from .serializers import *

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_notifications(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.user != user:
        return Response(status=status.HTTP_403_FORBIDDEN)

    notifications = Notification.objects.filter(user=user).order_by('-timestamp')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_notification_as_read(request, notification_id):
    try:
        notification = Notification.objects.get(pk=notification_id)
    except Notification.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if notification.user != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)

    notification.is_read = True
    notification.save()
    serializer = NotificationSerializer(notification)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def users_list(request):
    if request.method == "GET":
        username = request.query_params.get('username', None)
        pk = request.query_params.get('pk', None)  # Add this line

        if username:
            try:
                user = User.objects.get(username=username)
                serializer = UserSerializer(user, context={"request": request})
                return Response([serializer.data])  # Wrap in a list for consistency
            except User.DoesNotExist:
                return Response([], status=status.HTTP_404_NOT_FOUND)  # Return an empty list if user not found
        elif pk:  # Add this block
            try:
                user = User.objects.get(pk=pk)
                serializer = UserSerializer(user, context={"request": request})
                return Response([serializer.data])  # Wrap in a list for consistency
            except User.DoesNotExist:
                return Response([], status=status.HTTP_404_NOT_FOUND)  # Return an empty list if user not found
        else:
            data = User.objects.all()
            serializer = UserSerializer(data, context={"request": request}, many=True)
            return Response(serializer.data)

    elif request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def users_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == "PUT":
        # Handle profile picture update
        full_name = request.data.get('full_name')
        email = request.data.get('email')
        profile_picture = request.FILES.get('profile_picture')

        user.full_name = full_name if full_name else user.full_name
        user.email = email if email else user.email
        if profile_picture:
            user.profile_picture = profile_picture
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK) # or HTTP_204_NO_CONTENT

    elif request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_status_updates(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        status_updates = user.status_updates.all().order_by('-timestamp')  # Newest first
        serializer = StatusUpdateSerializer(status_updates, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = StatusUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)  # Automatically associate with the user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
