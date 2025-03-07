from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import User, StatusUpdate
from .serializers import *


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
        if username:
            try:
                user = User.objects.get(username=username)
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
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
