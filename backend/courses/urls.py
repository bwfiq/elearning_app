from django.urls import path
from .views import CourseListCreate, CourseRetrieveUpdateDestroy, EnrollCourse

urlpatterns = [
    path('courses/', CourseListCreate.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseRetrieveUpdateDestroy.as_view(), name='course-retrieve-update-destroy'),
    path('courses/<int:pk>/enroll/', EnrollCourse.as_view(), name='course-enroll'), # New line
]
