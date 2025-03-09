Okay, here's a comprehensive `README.md` file tailored for your eLearning application, incorporating details requested in the assignment report and highlighting implemented/unimplemented features.

```markdown
# eLearning Application

## Introduction

This project is an eLearning web application developed as the final coursework for CM3035 - Advanced Web Development. It leverages Django, Django REST Framework, Channels, and WebSockets to provide a platform for teachers to create and manage courses, students to enroll, interact, and share feedback, and for real-time communication.

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
*   **Status Updates:**
    *   Students can post status updates to their home pages.
*   **Courses:**
    *   Teachers can create courses with names and descriptions.
    *   Students can view a list of available courses and enroll.
    *   Teachers can upload course materials (text, files).
*   **Course Materials:**
    * Course material objects linked to course objects
    * Materials can be text, PDFs, images or other file objects
    * Materials are uploaded by teachers
*   **Course Feedback:**
    *   Students can leave feedback for a course.
*   **Real-time Chat (Basic):**
    *   Basic real-time text chat functionality using WebSockets.
*   **REST API:**
    *   RESTful interface for user data (list, detail, registration, status updates).
    *   Token-based authentication using `rest_framework_simplejwt`.

### To Be Implemented

*   **Teacher Functionality:**
    *   Teacher search for students and other teachers.
    *   Teacher removal/blocking of students from courses.
*   **Notifications:**
    *   Notifications to teachers when students enroll in their courses.
    *   Notifications to students when new material is added to a course.

## Technology Stack

*   **Backend:**
    *   Python 3.x
    *   Django 5.1.6
    *   Django REST Framework
    *   Django Channels
    *   Channels-Redis
    *   Rest Framework Simple JWT
    *   SQLite3
*   **Frontend:**
    *   React
    *   TypeScript
    *   Axios
*   **Other:**
    *   Redis (for Channels)

## Setup Instructions

### Prerequisites

*   Python 3.x installed
*   Redis server installed and running

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <project_directory>
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
    python manage.py runserver
    ```

6.  **Start the React frontend:**

    ```bash
    cd ../frontend
    npm install
    npm start
    ```

### Running Channels

1.  **Start Redis server:** (If not already running)
2.  **Run Daphne server**
    ```bash
    daphne backend.asgi:application --port 8000
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
In this project, I initially faced challenges in integrating Django Channels for real-time communication. The configuration required a deep understanding of ASGI and Redis. However, with thorough research and experimentation, I successfully implemented basic WebSocket functionality for the chat feature. I also had trouble with permissions but after working with the teacher role I was able to apply the functionality to other parts of the project. If I were to attempt this project again, I would prioritize a more modular design with clearer separation of concerns, allowing for easier testing and maintenance.

## Development Environment

*   **Operating System:** Linux (NixOS 25.05) 
*   **Python Version:** 3.12

