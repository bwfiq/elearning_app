# backend/courses/urls.py
from django.urls import path
from .views import CourseListCreate, CourseRetrieveUpdateDestroy, EnrollCourse, CourseMaterialListCreate, CourseMaterialRetrieveUpdateDestroy

urlpatterns = [
    path('courses/', CourseListCreate.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseRetrieveUpdateDestroy.as_view(), name='course-retrieve-update-destroy'),
    path('courses/<int:pk>/enroll/', EnrollCourse.as_view(), name='course-enroll'),
    path('courses/<int:course_id>/materials/', CourseMaterialListCreate.as_view(), name='course-material-list-create'),
    path('courses/<int:course_id>/materials/<int:pk>/', CourseMaterialRetrieveUpdateDestroy.as_view(), name='course-material-retrieve-update-destroy'),
]
