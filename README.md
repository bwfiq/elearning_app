# eLearning Application

## Introduction

This project is an eLearning web application developed as the final coursework for CM3035 - Advanced Web Development. It leverages Django, Django REST Framework, Channels, WebSockets, and Celery to provide a comprehensive platform. Teachers can create and manage courses, students can enroll, interact, and share feedback, with real-time communication and asynchronous task processing for notifications.

## Features

### Implemented

*   **User Authentication:**
    *   User registration with password security.
    *   User login and logout functionality.
    *   Two user types: students and teachers.
*   **User Profiles:**
    *   Storage of user information (username, full name, email, profile picture, registration date).
    *   User homepage displaying user information, enrolled courses, status updates.
    *   Discoverable and visible user homepages.
    *   Profile picture upload and display.
    *   Profile editing (full name, email, profile picture).
*   **Status Updates:**
    *   Students can post status updates to their home pages.
*   **Courses:**
    *   Teachers can create courses with names and descriptions.
    *   Students can view a list of available courses and enroll/unenroll.
    *   Teachers can upload course materials (text, files).
    *   Teachers can remove students from courses.
*   **Course Materials:**
    *   Course material objects linked to course objects.
    *   Materials can be text, PDFs, images or other file objects.
    *   Materials are uploaded by teachers.
*   **Course Feedback:**
    *   Students can leave feedback for a course.
*   **Real-time Chat (Basic):**
    *   Basic real-time text chat functionality using WebSockets.
*   **Notifications:**
    *   Asynchronous notifications using Celery for:
        *   Students when they enroll or unenroll in courses.
        *   Teachers when students enroll in their courses.
        *   Students when new material is added to a course.
        *   Students when they are removed from a course.
    *   User-specific notification feed with read/unread status.
*   **REST API:**
    *   RESTful interface for user data (list, detail, registration, status updates).
    *   Token-based authentication using `rest_framework_simplejwt`.

## Technology Stack

*   **Backend:**
    *   Python 3.x
    *   Django 5.1.6
    *   Django REST Framework
    *   Django Channels
    *   Channels-Redis
    *   Rest Framework Simple JWT
    *   Celery
    *   SQLite3
*   **Frontend:**
    *   React
    *   TypeScript
    *   Axios
*   **Other:**
    *   Redis (for Channels and Celery)

## Setup Instructions

### Prerequisites

*   Python 3.x installed
*   Redis server installed and running

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/bwfiq/elearning_app
    cd elearning_app
    ```

2.  **Create and activate a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate   # On Linux/macOS
    venv\Scripts\activate  # On Windows
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Apply migrations:**

    ```bash
    cd backend
    python manage.py migrate
    ```

5.  **Run Django development server:**

    ```bash
    python manage.py runserver # Also runs daphne for websockets
    ```

6.  **Start Celery worker in a separate process:**

    ```bash
    celery -A backend worker -l info
    ```

7.  **Start the React frontend in a separate process:**

    ```bash
    cd ../frontend
    npm install
    npm start
    ```
### Running Unit Tests

```bash
cd backend
python manage.py test
```

### Creating a Superuser (Django Admin)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin user.

## Login Credentials

### Django Admin

*   **Username:** admin
*   **Password:** admin

### Teacher Account

*   **Username:** testteacher
*   **Password:** testpassword

### Student Account

*   **Username:** testuser
*   **Password:** testpassword

## Database Design

The database is designed to store information about users, courses, course materials, feedback, and real-time chat messages. Key models include:

*   **User:** Extends Django's `AbstractUser` to include `full_name`, `profile_picture`, and `is_teacher` fields.
*   **Course:** Stores course information, including the creator (teacher), name, description, and enrolled students.
*   **CourseMaterial:** Stores course materials associated with a course, including the uploaded file or text content, uploader, and upload date.
*   **CourseFeedback:** Stores feedback provided by students for courses, including the text content and timestamp.
*   **Message:** Stores individual chat messages with user and timestamp information.
*   **StatusUpdate:** Records user-specific updates
*   **Notification:** Stores notifications for users, including the message, timestamp, and read status.

Relationships are established using ForeignKey and ManyToManyField relationships.

## REST API Endpoints

*   `/api/users/`:
    *   `GET`: List all users (with optional filtering by username or pk).
    *   `POST`: Create a new user (registration).
*   `/api/users/<pk>/`:
    *   `GET`: Retrieve user details.
    *   `PUT`: Update user details.
    *   `DELETE`: Delete a user.
*   `/api/users/<user_id>/status_updates/`:
    *   `GET`: List status updates for a user.
    *   `POST`: Create a new status update for a user.
*   `/api/users/<user_id>/notifications/`:
    *   `GET`: List notifications for a user.
*   `/api/users/notifications/<notification_id>/mark_as_read/`:
    *   `PATCH`: Mark a notification as read.
*   `/api/token/`:
    *   `POST`: Obtain JWT access and refresh tokens.
*   `/api/token/refresh/`:
    *   `POST`: Refresh JWT access token.
*   `/api/courses/`:
    *   `GET`: List all courses.
    *   `POST`: Create a new course (teachers only).
*   `/api/courses/<pk>/`:
    *   `GET`: Retrieve course details.
    *   `PUT`: Update course details (course creator only).
    *   `DELETE`: Delete a course (course creator only).
*   `/api/courses/<pk>/enroll/`:
    *   `PATCH`: Enroll/unenroll a student in a course.
*   `/api/courses/<pk>/remove_student/`:
    *   `PATCH`: Remove a student from a course (teachers only).
*   `/api/courses/<course_id>/materials/`:
    *   `GET`: List course materials.
    *   `POST`: Upload course materials (teachers only).
*   `/api/courses/<course_id>/materials/<pk>/`:
    *   `GET`: Retrieve course material details.
    *   `PUT`: Update course material details.
    *   `DELETE`: Delete a course material.
*   `/api/courses/<course_id>/feedback/`:
    *   `GET`: List course feedback.
    *   `POST`: Leave feedback for a course.

## Notes

In this project, I initially faced challenges in integrating Django Channels for real-time communication. The configuration required a deep understanding of ASGI and Redis. However, with thorough research and experimentation, I successfully implemented basic WebSocket functionality for the chat feature. The integration of Celery for asynchronous notifications added another layer of complexity, requiring careful configuration of the Celery worker and task scheduling. If I were to attempt this project again, I would prioritize a more modular design with clearer separation of concerns, allowing for easier testing and maintenance.

## Development Environment

*   **Operating System:** Linux (NixOS 25.05)
*   **Python Version:** 3.12
