# backend/courses/views.py
from rest_framework import generics, permissions
from .models import Course, CourseMaterial, CourseFeedback
from .serializers import CourseSerializer, CourseEnrollSerializer, CourseMaterialSerializer, CourseFeedbackSerializer
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_teacher

class IsCourseCreator(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.creator == request.user

class IsEnrolled(BasePermission):
    def has_permission(self, request, view):
        course_id = view.kwargs['course_id']
        course = get_object_or_404(Course, pk=course_id)
        return request.user in course.students.all() or request.user == course.creator

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
    permission_classes = [IsAuthenticated, IsCourseCreator]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsTeacher(), IsCourseCreator()]
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

        if user.is_teacher:
            return Response({'detail': 'Teachers cannot enroll in courses.'}, status=status.HTTP_403_FORBIDDEN)

        if user in course.students.all():
            course.students.remove(user)
            return Response({'status': 'un enrolled'}, status=status.HTTP_200_OK)
        else:
            course.students.add(user)
            return Response({'status': 'enrolled'}, status=status.HTTP_200_OK)

class IsCourseCreatorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow creators of a course to edit or delete it.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if user is course creator
        course_id = view.kwargs.get('course_id')
        if course_id is None:
            return False
        course = get_object_or_404(Course, pk=course_id)
        return course.creator == request.user

class CourseMaterialListCreate(generics.ListCreateAPIView):
    serializer_class = CourseMaterialSerializer
    permission_classes = [IsAuthenticated, IsEnrolled, IsCourseCreatorOrReadOnly]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return CourseMaterial.objects.filter(course_id=course_id).order_by('-upload_date')

    def perform_create(self, serializer):
        course = get_object_or_404(Course, pk=self.kwargs['course_id'])
        serializer.save(course=course, uploaded_by=self.request.user)

class CourseMaterialRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CourseMaterialSerializer
    permission_classes = [IsAuthenticated, IsEnrolled]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return CourseMaterial.objects.filter(course_id=course_id)

    def get_object(self):
         return get_object_or_404(CourseMaterial, pk=self.kwargs['pk'])

    def perform_update(self, serializer):
        material = self.get_object()
        if self.request.user != material.uploaded_by and not self.request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.uploaded_by and not self.request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        instance.delete()

class CourseFeedbackListCreate(generics.ListCreateAPIView):
    serializer_class = CourseFeedbackSerializer
    permission_classes = [IsAuthenticated, IsEnrolled]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return CourseFeedback.objects.filter(course_id=course_id).order_by('-timestamp')

    def perform_create(self, serializer):
        course = get_object_or_404(Course, pk=self.kwargs['course_id'])
        serializer.save(course=course, user=self.request.user)
