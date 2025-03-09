# courses/views.py
from rest_framework import generics, permissions
from .models import Course
from .serializers import CourseSerializer, CourseEnrollSerializer #Import CourseEnrollSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_teacher

class CourseListCreate(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsTeacher()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class CourseRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsTeacher()]
        return [IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.creator != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.creator != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class EnrollCourse(generics.UpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseEnrollSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Course, pk=self.kwargs['pk'])

    def update(self, request, *args, **kwargs):
        course = self.get_object()
        user = request.user

        if user in course.students.all():
            course.students.remove(user)
            return Response({'status': 'un enrolled'}, status=status.HTTP_200_OK)
        else:
            course.students.add(user)
            return Response({'status': 'enrolled'}, status=status.HTTP_200_OK)
