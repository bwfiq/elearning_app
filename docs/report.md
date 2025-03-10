# E-Learning Platform Application Report

**Author:** Mohammad Rafiq
**Date:** 10 March 2025

---

## 1. Introduction

### Project Overview

This report details the design and implementation of an e-learning platform application. The platform allows teachers to create courses and upload materials, and students to enroll in courses, access materials, and interact with each other and the teacher via real-time chat. The application is built using a modern technology stack, including React for the frontend and Django for the backend, ensuring a scalable and maintainable solution. Docker is used for containerisation and deployment, streamlining the process of setting up and running the application in different environments.

### Requirements

The application aims to meet the following core requirements:

*   **R1:** User Authentication and Authorisation: Securely manage user accounts with different roles (teacher and student).
*   **R2:** Course Management: Allow teachers to create, update, and delete courses.
*   **R3:** Course Material Upload and Access: Enable teachers to upload course materials (text, files) and students to access them.
*   **R4:** User Profile Management: Allow users to manage their profiles, including updating personal information and profile picture.
*   **R5:** Real-time Chat Functionality: Provide a real-time chat feature for communication between users within the platform.

## 2. Application Design and Architecture

### Overall Architecture

The application follows a three-tier architecture:

1.  **Frontend (Presentation Tier):** Built using React, responsible for presenting the user interface and handling user interactions.
2.  **Backend (Application Tier):** Built using Django, responsible for handling business logic, data processing, and API endpoints.
3.  **Database (Data Tier):** Uses SQLite as the database, responsible for storing application data.

This separation of concerns promotes modularity, making the application easier to maintain and scale.

### Directory Structure

The project's directory structure is organised as follows:

```
└── ./
    ├── .github
    │   └── workflows
    │       └── docker-build-push.yml
    ├── backend
    │   ├── backend
    │   │   ├── __init__.py
    │   │   ├── asgi.py
    │   │   ├── celery.py
    │   │   ├── settings.py
    │   │   ├── urls.py
    │   │   └── wsgi.py
    │   ├── chat
    │   │   ├── migrations
    │   │   │   ├── __init__.py
    │   │   │   └── 0001_initial.py
    │   │   ├── __init__.py
    │   │   ├── admin.py
    │   │   ├── apps.py
    │   │   ├── consumers.py
    │   │   ├── models.py
    │   │   ├── routing.py
    │   │   ├── tests.py
    │   │   └── views.py
    │   ├── courses
    │   │   ├── migrations
    │   │   │   ├── __init__.py
    │   │   │   ├── 0001_initial.py
    │   │   │   ├── 0002_coursematerial.py
    │   │   │   └── 0003_coursefeedback.py
    │   │   ├── __init__.py
    │   │   ├── admin.py
    │   │   ├── apps.py
    │   │   ├── filters.py
    │   │   ├── models.py
    │   │   ├── serializers.py
    │   │   ├── tasks.py
    │   │   ├── tests.py
    │   │   ├── urls.py
    │   │   └── views.py
    │   ├── users
    │   │   ├── migrations
    │   │   │   ├── __init__.py
    │   │   │   ├── 0001_initial.py
    │   │   │   ├── 0002_users.py
    │   │   │   ├── 0003_alter_user_options_alter_user_managers_and_more.py
    │   │   │   ├── 0004_statusupdate.py
    │   │   │   └── 0005_notification.py
    │   │   ├── __init__.py
    │   │   ├── admin.py
    │   │   ├── apps.py
    │   │   ├── filters.py
    │   │   ├── models.py
    │   │   ├── serializers.py
    │   │   ├── tests.py
    │   │   ├── urls.py
    │   │   └── views.py
    │   ├── Dockerfile
    │   ├── manage.py
    │   ├── requirements.txt
    │   └── setup.py
    ├── frontend
    │   ├── public
    │   │   ├── favicon.ico
    │   │   ├── index.html
    │   │   ├── logo192.png
    │   │   ├── logo512.png
    │   │   ├── manifest.json
    │   │   └── robots.txt
    │   ├── src
    │   │   ├── App.css
    │   │   ├── App.tsx
    │   │   ├── Chat.tsx
    │   │   ├── Config.js
    │   │   ├── CourseList.tsx
    │   │   ├── CoursePage.tsx
    │   │   ├── index.css
    │   │   ├── index.tsx
    │   │   ├── Login.tsx
    │   │   ├── logo.svg
    │   │   ├── Navbar.tsx
    │   │   ├── Notifications.tsx
    │   │   ├── react-app-env.d.ts
    │   │   ├── Register.tsx
    │   │   ├── reportWebVitals.ts
    │   │   ├── setupTests.ts
    │   │   ├── types.ts
    │   │   ├── useAxios.tsx
    │   │   ├── UserHomePage.tsx
    │   │   └── UserList.tsx
    │   ├── Dockerfile
    │   ├── package-lock.json
    │   ├── package.json
    │   └── tsconfig.json
    ├── .envrc
    ├── .gitignore
    ├── default.nix
    ├── docker-compose.yml
    ├── nginx.conf
    └── README.md
```

*   `.github/workflows`: Contains the GitHub Actions workflow configuration for continuous integration and continuous deployment (CI/CD).
*   `backend`: Contains the Django backend application.
    *   `backend`: The main Django project directory.
    *   `chat`: Django app for real-time chat functionality using Channels and WebSockets.
    *   `courses`: Django app for course management functionality.
    *   `users`: Django app for user authentication, authorisation, and profile management.
    *   `Dockerfile`: Dockerfile for building the backend Docker image.
    *   `manage.py`: Django's command-line utility for administrative tasks.
    *   `requirements.txt`: List of Python packages required for the backend.
    *   `setup.py`: Used to generate fake data for testing the API.
*   `frontend`: Contains the React frontend application.
    *   `public`: Contains static assets like HTML, images, and manifest files.
    *   `src`: Contains the React components, styles, and logic.
    *   `Dockerfile`: Dockerfile for building the frontend Docker image.
    *   `package.json`: Contains the project's dependencies and scripts.
*   `.envrc`: Environment configuration file.
*   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
*   `default.nix`: Nix package manager configuration.
*   `docker-compose.yml`: Docker Compose configuration for defining and running multi-container Docker applications.
*   `nginx.conf`: Nginx web server configuration.
*   `README.md`: Project documentation and instructions.

### Frontend Design (React)

The frontend is built using React, a JavaScript library for building user interfaces. React's component-based architecture allows for creating reusable UI elements, making the application more maintainable.

#### Component Structure

The frontend's component structure is organised to reflect the application's functionality. Key components include:

*   `App.tsx`: The root component that renders the main application layout and routing.
*   `Login.tsx`: Component for user login.
*   `Register.tsx`: Component for user registration.
*   `CourseList.tsx`: Component for displaying a list of courses.
*   `CoursePage.tsx`: Component for displaying details of a specific course.
*   `Chat.tsx`: Component for real-time chat functionality.
*   `Navbar.tsx`: Main navigation component.
*   `Notifications.tsx`: Component to display user notifications.
*   `UserHomePage.tsx`: Component for a user's home page.
*   `UserList.tsx`: Component for listing users.

This component structure allows for easy navigation and modular development.

#### State Management

React's built-in state management is used for handling component-specific data. For global state management, such as user authentication status, a context API or a library like Redux could be integrated for more complex applications.

#### Axios Integration

The frontend uses Axios, a promise-based HTTP client, to communicate with the Django backend. The `useAxios.tsx` file contains a custom hook for making API requests.

```typescript
// frontend/src/useAxios.tsx
import axios from 'axios';

const useAxios = () => {
  const api = axios.create({
    baseURL: 'http://localhost:8000/api', 
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return api;
};

export default useAxios;
```

This hook simplifies making API requests by providing a pre-configured Axios instance. It is better than just using the raw `axios` library because it centralises the configuration and allows adding interceptors to automatically handle tasks like adding authentication headers.

### Backend Design (Django)

The backend is built using Django, a high-level Python web framework. Django's Model-View-Serializer (MVS) architectural pattern is followed to organise the backend logic.

#### Model Design

Django models are used to define the data structure of the application. Key models include:

*   `User` (in `users/models.py`): Represents a user of the platform, extending Django's built-in `AbstractUser` model.
    ```python
    # users/models.py
    from django.db import models
    from django.conf import settings
    from django.contrib.auth.models import AbstractUser

    class User(AbstractUser):
        full_name = models.CharField("Full Name", max_length=240, blank=True)
        profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
        is_teacher = models.BooleanField(default=False)
        registration_date = models.DateField("Registration Date", auto_now_add=True)

        def __str__(self):
            return self.username
    ```

    It was decided to extend Django's default user model because it provides all the authentication infrastructure while still giving customisation options.
*   `StatusUpdate` (in `users/models.py`): Stores status updates posted by users.
    ```python
    class StatusUpdate(models.Model):
        user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='status_updates')
        text = models.TextField()
        timestamp = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return f"{self.user.username}: {self.text[:50]}"
    ```
*   `Notification` (in `users/models.py`): Stores notifications for users.
    ```python
    class Notification(models.Model):
        user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
        message = models.TextField()
        timestamp = models.DateTimeField(auto_now_add=True)
        is_read = models.BooleanField(default=False)

        def __str__(self):
            return f"Notification for {self.user.username}: {self.message[:50]}"
    ```
*   `Course` (in `courses/models.py`): Represents a course offered on the platform.
    ```python
    # courses/models.py
    from django.db import models
    from django.conf import settings

    class Course(models.Model):
        creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_courses')
        name = models.CharField(max_length=200)
        description = models.TextField(blank=True)
        students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='enrolled_courses', blank=True)

        def __str__(self):
            return self.name
    ```
*   `CourseMaterial` (in `courses/models.py`): Stores materials for a course (text, files).
    ```python
    class CourseMaterial(models.Model):
        course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materials')
        uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
        text_content = models.TextField(blank=True)
        file = models.FileField(upload_to='course_materials/', blank=True, null=True)
        upload_date = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            if self.text_content:
                return f"Text: {self.text_content[:20]}... ({self.course.name})"
            else:
                return f"File: {self.file.name} ({self.course.name})"
    ```
*   `CourseFeedback` (in `courses/models.py`): Stores feedback given by students for a course.
    ```python
    class CourseFeedback(models.Model):
        course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='feedback')
        user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
        text = models.TextField()
        timestamp = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return f"Feedback by {self.user.username} on {self.course.name}"
    ```
*    `Message` (in `chat/models.py`): Represents a chat message, associating it with a user and its content.

#### View Design

Django views handle the business logic and API endpoints. Generic class-based views are used to simplify common tasks like listing, creating, retrieving, updating, and deleting objects. For example:

*   `CourseListCreate` (in `courses/views.py`): Lists all courses and allows creating new courses.
    ```python
    # courses/views.py
    from rest_framework import generics, permissions, status
    from rest_framework.response import Response
    from rest_framework.permissions import IsAuthenticated, BasePermission
    from django.shortcuts import get_object_or_404
    from .models import Course, CourseMaterial, CourseFeedback
    from .serializers import CourseSerializer, CourseEnrollSerializer, CourseMaterialSerializer, CourseFeedbackSerializer, CourseRemoveStudentSerializer
    from users.models import User  # Import the User model
    from .tasks import send_enrollment_notification, send_unenrollment_notification, send_removal_notification, send_teacher_enrollment_notification
    from .filters import CourseFilter

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
        filterset_class = CourseFilter

        def get_permissions(self):
            if self.request.method == 'POST':
                return [IsAuthenticated(), IsTeacher()]
            return [IsAuthenticated()]

        def perform_create(self, serializer):
            serializer.save(creator=self.request.user)
    ```
*   `CourseRetrieveUpdateDestroy` (in `courses/views.py`): Retrieves, updates, and deletes a specific course.
*   `EnrollCourse` (in `courses/views.py`): Allows a user to enroll in or unenroll from a course.
*   `CourseMaterialListCreate` (in `courses/views.py`): Lists course materials and allows creating new materials.
*   `CourseFeedbackListCreate` (in `courses/views.py`): Lists course feedback and allows creating new feedback.
*    `users_list` (in `users/views.py`): Lists all users.
*    `user_status_updates` (in `users/views.py`):  Lists a user's status updates.
*    `mark_notification_as_read` (in `users/views.py`):  Marks a user's notification as read.

Using generic class-based views speeds up development and reduces the amount of boilerplate code.

#### Serializer Design

Django serializers are used to convert model instances into JSON format for API responses and vice versa. For example:

*   `CourseSerializer` (in `courses/serializers.py`): Serializes `Course` objects.
    ```python
    # /backend/courses/serializers.py
    from rest_framework import serializers
    from .models import Course, CourseMaterial, CourseFeedback

    class CourseSerializer(serializers.ModelSerializer):
        creator_username = serializers.ReadOnlyField(source='creator.username')
        
        class Meta:
            model = Course
            fields = '__all__'
            read_only_fields = ('creator',)
    ```
*   `CourseMaterialSerializer` (in `courses/serializers.py`): Serializes `CourseMaterial` objects.
*   `UserSerializer` (in `users/serializers.py`): Serializes `User` objects.
*    `StatusUpdateSerializer` (in `users/serializers.py`): Serializes StatusUpdate objects.

Serializers ensure data is formatted consistently for API interactions.

#### URL Design

Django URLs are used to map API endpoints to their corresponding views. For example:

*   `courses/urls.py`:
    ```python
    # backend/courses/urls.py
    from django.urls import path
    from .views import CourseListCreate, CourseRetrieveUpdateDestroy, EnrollCourse, CourseMaterialListCreate, CourseMaterialRetrieveUpdateDestroy, CourseFeedbackListCreate, RemoveStudentFromCourse

    urlpatterns = [
        path('courses/', CourseListCreate.as_view(), name='course-list-create'),
        path('courses/<int:pk>/', CourseRetrieveUpdateDestroy.as_view(), name='course-retrieve-update-destroy'),
        path('courses/<int:pk>/enroll/', EnrollCourse.as_view(), name='course-enroll'),
        path('courses/<int:course_id>/materials/', CourseMaterialListCreate.as_view(), name='course-material-list-create'),
        path('courses/<int:course_id>/materials/<int:pk>/', CourseMaterialRetrieveUpdateDestroy.as_view(), name='course-material-retrieve-update-destroy'),
        path('courses/<int:course_id>/feedback/', CourseFeedbackListCreate.as_view(), name='course-feedback-list-create'),
        path('courses/<int:pk>/remove_student/', RemoveStudentFromCourse.as_view(), name='course-remove-student'),
    ]
    ```
*   `users/urls.py`:
    ```python
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
    ```

URLs are designed to be RESTful, making the API easy to understand and use.

#### Authentication and Permissions

Django's authentication framework is used to manage user accounts and authentication. Permissions are used to control access to specific API endpoints based on user roles (teacher and student).

*   `IsTeacher` permission (in `courses/views.py`): Allows access only to teacher users.
*   `IsCourseCreator` permission (in `courses/views.py`): Allows access only to the creator of a course.
*   `IsEnrolled` permission (in `courses/views.py`): Allows access only to students enrolled in a course, or the course creator.

```python
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
```

These permissions ensure that only authorised users can perform specific actions.

JWT (JSON Web Token) authentication is used for securing the API endpoints. JWT is a standard method for representing claims securely between two parties. Simple JWT library used in the following way:

```python
    REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly'
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend']
}
```

#### Celery Integration

Celery is used for asynchronous task processing, such as sending enrollment notifications. This prevents blocking the main application thread and improves performance. For example, `send_enrollment_notification` (in `courses/tasks.py`) is a Celery task that sends an email notification to a user when they enroll in a course.

```python
# courses/tasks.py
from celery import shared_task
from django.contrib.auth import get_user_model
from users.models import Notification

@shared_task
def send_enrollment_notification(user_id, course_name):
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    message = f"You have been enrolled in the course: {course_name}."
    Notification.objects.create(user=user, message=message)
```

This ensures that the notification is sent in the background without slowing down the user's enrollment process.

#### Channels and WebSockets for Chat

Django Channels, along with WebSockets, are used to implement the real-time chat functionality. Channels allows handling WebSockets alongside regular HTTP requests, and WebSockets provide a persistent connection between the client and server for real-time communication.

*   `ChatConsumer` (in `chat/consumers.py`): Handles WebSocket connections and message exchange.
    ```python
    # backend/chat/consumers.py
    import os
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

    import django
    django.setup()

    import json
    from channels.generic.websocket import AsyncWebsocketConsumer
    from channels.db import database_sync_to_async
    from django.contrib.auth import get_user_model
    from .models import Message

    User = get_user_model()

    class ChatConsumer(AsyncWebsocketConsumer):
        async def connect(self):
            self.room_name = 'chat'
            self.room_group_name = f'chat_{self.room_name}'

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

        async def disconnect(self, close_code):
            # Leave room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

        # Receive message from WebSocket
        async def receive(self, text_data):
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            username = text_data_json['username']

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': username,
                }
            )
            await self.save_message(username, message) # Persist the message

        # Receive message from room group
        async def chat_message(self, event):
            message = event['message']
            username = event['username']

            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'message': message,
                'username': username,
            }))

        @database_sync_to_async
        def save_message(self, username, message):
            user = User.objects.get(username=username)
            Message.objects.create(user=user, content=message)
    ```

*   `chat/routing.py`: Defines the URL routing for WebSocket connections.
    ```python
    # backend/chat/routing.py
    from django.urls import re_path

    from . import consumers

    websocket_urlpatterns = [
        re_path(r'ws/chat/$', consumers.ChatConsumer.as_asgi()),
    ]
    ```

This allows users to send and receive messages in real-time.

#### Django Filters

Django Filters is used for applying search filters to the list of courses and users using the fuzzywuzzy library. This library enables the use of fuzzy search, and fuzzy search is implemented across all fields of all data models so users can search for any term and find a relevant user or course.

For courses:
```python
# backend/courses/filters.py
import django_filters
from .models import Course
from fuzzywuzzy import fuzz

class CourseFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='fuzzy_search')

    class Meta:
        model = Course
        fields = []

    def fuzzy_search(self, queryset, name, value):
        search_ratio = 60
        filtered_courses = []
        for course in queryset:
            fields_to_search = [course.name, course.description]
            for field in fields_to_search:
                if field:
                    match_ratio = fuzz.partial_token_sort_ratio(value, field)
                    if match_ratio >= search_ratio:
                        filtered_courses.append(course.id)
                        break  # Avoid adding the same course multiple times
        return queryset.filter(id__in=filtered_courses)
```
For Users:
```python
# backend/users/filters.py
import django_filters
from .models import User
from fuzzywuzzy import fuzz

class UserFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='fuzzy_search')

    class Meta:
        model = User
        fields = []

    def fuzzy_search(self, queryset, name, value):
        search_ratio = 60
        filtered_users = []
        for user in queryset:
            fields_to_search = [user.username, user.full_name, user.email]
            for field in fields_to_search:
                if field:
                    match_ratio = fuzz.partial_token_sort_ratio(value, field)
                    if match_ratio >= search_ratio:
                        filtered_users.append(user.id)
                        break  # Avoid adding the same user multiple times
        return queryset.filter(id__in=filtered_users)
```

This ensures that users can find content through user and course names.

### Database Design

The application uses SQLite as its database. The database stores information about:

*   Users (username, full name, email, password, profile picture, teacher status)
*   Courses (creator, name, description, enrolled students)
*   Course materials (course, uploader, text content, file)
*   Course feedback (course, user, text, timestamp)
*   Status updates (user, text, timestamp)
*   Notifications (user, message, timestamp, read status)
*    Messages (user, content, timestamp)

SQLite was chosen for its simplicity in development. PostgreSQL would be the choice to scale up, because it is more robust, scalable and has features like full text search.

### Dockerization

Docker is used to containerise the application, making it easier to deploy and run in different environments.

#### Dockerfile Configuration

The project includes `Dockerfile`s for both the frontend and backend. These files define the steps to build Docker images for each part of the application.

Backend Dockerfile: Care was taken to remove all unneeded requirements from the virtual environment, culling those that were not needed, as well as choosing to use the lightest possible base image. This resulted in a size reduction of the final Docker image from 1GB to 200MB.

```dockerfile
FROM python:3.12-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1 \
    PYTHONUNBUFFERED 1

# Copy requirements file
COPY requirements.txt /
RUN pip install --no-cache-dir -r /requirements.txt

# Copy the backend code
WORKDIR /app
COPY . .
RUN python manage.py migrate --noinput && \
    python manage.py collectstatic --noinput && \
    python setup.py # This populates the db with fake data; remove if not needed

# Expose port 8000 and 8001
EXPOSE 8000
EXPOSE 8001


# Start the application with gunicorn and daphne
CMD gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3 --threads 2 & \
    daphne backend.asgi:application -b 0.0.0.0 -p 8001
```

Frontend Dockerfile:

The multi-stage Dockerfile builds the React app in a Node.js environment and serves it with Nginx. Building the Node project in a first build stage and only exporting the generated static files to the production stage, along with choosing the lightest possible web server base image (utilising httpd) led to a size reduction from 1GB to ~1MB in the final image.

```dockerfile
# Stage 1: Prepare the Node.js build environment
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . /app
RUN npm run build --production

# Stage 2: Copy over build and run the app
FROM lipanski/docker-static-website:latest

# Copy necessary files from the builder stage
COPY --from=builder /app/build .

CMD ["/busybox-httpd", "-f", "-v", "-p", "3000"]
```

#### Docker Compose

Docker Compose is used to define and manage the Docker containers. The `docker-compose.yml` file defines the services for the frontend, backend, redis cache, and the celery worker.

```yaml
services:
  redis:
    container_name: elearning_app_redis
    image: "redis:latest"
    networks:
      - bridge

  backend:
    container_name: elearning_app_backend
    image: ghcr.io/bwfiq/elearning_app/elearning-backend
    restart: always
    environment:
      REDIS_HOST: elearning_app_redis
      REDIS_PORT: 6379
      DJANGO_SECRET_KEY: ${DJANGO_SECRET_KEY}
      DEBUG: "False"
    depends_on:
      - redis
    networks:
      - bridge

  celery:
    container_name: elearning_app_celery
    image: ghcr.io/bwfiq/elearning_app/elearning-backend
    restart: always
    command: celery -A backend worker -l info
    environment:
      REDIS_HOST: elearning_app_redis
      REDIS_PORT: 6379
      DJANGO_SECRET_KEY: ${DJANGO_SECRET_KEY}  # Replace with a secure key
    depends_on:
      - redis
      - backend
    networks:
      - bridge

  frontend:
    container_name: elearning_app_frontend
    image: ghcr.io/bwfiq/elearning_app/elearning-frontend
    restart: always
    depends_on:
      - backend
    networks:
      - bridge

networks:
  bridge:
    driver: bridge
```

---

The source code for this app can be found at https://github.com/bwfiq/elearning_app. The site has been deployed using the Docker Compose template and the nginx configuration file on a Debian server at https://elearning.bwfiq.com, with the API accessible at https://elearningapi.bwfiq.com. The Django admin credentials are:

* username: admin
* password: admin

---

I learned a lot about writing a full-stack application in the process of developing this assignment, and particularly learned a lot about what makes frontend frameworks tick and how they might connect to backend APIs. Containerising the application and figuring out how to connect the services was also a large hurdle in deploying the app, though one that came with a lot of learning opportunities. All in all, I am satisfied with the final product, and would love the opportunity to tackle a project like this again now that I learned what to do and what not to do, and can do it better.
