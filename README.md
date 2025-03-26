# eLearning App

This project is an eLearning web application built with Django (backend) and React (frontend). It allows users to create accounts, enroll in courses, access course materials, communicate in real-time, and more. This README provides comprehensive information about the project, including setup instructions, architecture, features, and deployment details.

## Table of Contents

1.  [Features](#features)
2.  [Technologies Used](#technologies-used)
3.  [Development Environment](#development-environment)
4.  [Directory Structure](#directory-structure)
5.  [Setup and Installation](#setup-and-installation)
6.  [Database](#database)
7.  [Backend Setup Script (setup.py)](#backend-setup-script-setuppy)
8.  [Docker](#docker)
9.  [API Endpoints](#api-endpoints)
10. [Deployment](#deployment)
11. [nginx.conf](#nginxconf)
12. [docker-compose.yml](#docker-composeyml)

## Features

*   **User Authentication:** Secure password-protected account creation, login, and logout.
*   **User Roles:** Differentiated user types (students and teachers) with specific permissions.  Teachers can create and manage courses, while students can enroll and access materials.
*   **User Profiles:**  "Home" pages displaying user information, enrolled courses, and status updates.  Profiles are discoverable by other users.
*   **Status Updates:** Students can post status updates to their profiles.
*   **Course Management:**
    *   Teachers can create, update, and delete courses.
    *   Teachers can upload course materials (text, files).
    *   Teachers can view enrolled students and remove them.
*   **Course Enrollment:** Students can browse available courses and enroll themselves.
*   **Feedback:** Students can leave feedback for courses.
*   **Real-time Communication:**  A real-time chat application built using WebSockets (Django Channels).
*   **Notifications:** Teachers are notified when students enroll in their courses. Students are notified when new course material is added.
*   **User Search:** Teachers can search for students and other teachers.
*   **REST API:** A RESTful API for user data.
*   **Filtering:** User and Course data can be filtered using a search query to Fuzzy Search the username, full name and email in users, or the name and description in courses.

## Technologies Used

*   **Backend:**
    *   **Django:** A high-level Python web framework.
    *   **Django REST Framework:** A powerful toolkit for building Web APIs.
    *   **Django Channels:**  Extends Django to handle WebSockets and asynchronous tasks.
    *   **Celery:**  An asynchronous task queue/job queue based on distributed message passing.
    *   **djangorestframework-simplejwt:** JSON Web Token (JWT) authentication for Django REST Framework.
    *   **django-filter:** Provides generic filtering for Django REST Framework.
    *   **FuzzyWuzzy:** Fuzzy string matching library.
    *   **Pillow:**  Image processing library (for handling profile pictures).
    *   **redis:** In-memory data structure store, used as a Celery broker and Channels layer.
    *   **whitenoise:** Serving static files in production.
    *   **gunicorn:** WSGI server.

*   **Frontend:**
    *   **React:** A JavaScript library for building user interfaces.
    *   **TypeScript:**  A superset of JavaScript that adds static typing.
    *   **Axios:**  HTTP client for making API requests.
    *   **package.json:** Defines dependencies for the React app.

## Development Environment

*   **Operating System:** Tested and developed on Linux (NixOS 25.05 and Debian 11).
*   **Python:** 3.12
*   **Node.js:** v16 (LTS)
*   **npm:** 8.x
*   **Direnv (Optional):** Used for managing environment variables (see setup below).
*   **Packages:** (See `backend/requirements.txt` for backend dependencies and `frontend/package.json` for frontend dependencies).

### Setting up the Development Environment

#### Using Direnv (Recommended)

1.  **Install Direnv:** Follow the instructions for your operating system from [https://direnv.net/](https://direnv.net/).

2.  **Install Nix (Optional):** For NixOS or other Linux distros, install Nix from [https://nixos.org/](https://nixos.org/).

3.  **Create `.envrc` file:** Copy and paste the relevant variables into the .envrc file for setting env variables

4.  **Enable Direnv:**  In your project directory, run `direnv allow`.  Direnv will automatically load the environment variables defined in `.envrc`.

#### Manual Setup

1.  **Install Python:** Ensure you have Python 3.12 installed.  Create a virtual environment:

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate  # On Linux/macOS
    # .venv\Scripts\activate  # On Windows
    ```

2.  **Install Backend Dependencies:**

    ```bash
    cd backend
    pip install -r requirements.txt
    cd ..
    ```

3.  **Install Node.js and npm:** Download and install Node.js v16 (LTS) from [https://nodejs.org/](https://nodejs.org/).

4.  **Install Frontend Dependencies:**

    ```bash
    cd frontend
    npm install
    cd ..
    ```

5.  **Set Environment Variables:**  Manually set the necessary environment variables (e.g., `DJANGO_SECRET_KEY`, `REDIS_HOST`, `REDIS_PORT`) in your shell or operating system. This depends on where you're hosting the app and what you're trying to integrate. See `.envrc` for a comprehensive list.
    ```bash
    DJANGO_SECRET_KEY='django-insecure-*z$s*fvvfupt-s5d084gu9_)p6p7$p9bp=0da08v40w%5wck5#'
    APP_URL='http://localhost:3000'
    ```

## Directory Structure

```
├── .github                 # GitHub Actions workflows
│   └── workflows
│       └── docker-build-push.yml # Automatically builds and pushes the Docker images to this repository
├── backend                 # Django backend application
│   ├── backend             # Core Django project
│   │   ├── __init__.py
│   │   ├── asgi.py         # ASGI configuration for asynchronous support (WebSockets)
│   │   ├── celery.py       # Celery configuration
│   │   ├── settings.py     # Django settings
│   │   ├── urls.py         # Project-level URL configuration
│   │   └── wsgi.py         # WSGI configuration for deployment
│   ├── chat                # Chat application
│   │   ├── migrations      # Database migrations
│   │   ├── __init__.py
│   │   ├── admin.py        # Admin panel configuration
│   │   ├── apps.py         # App configuration
│   │   ├── consumers.py    # WebSocket consumers (handling real-time communication)
│   │   ├── models.py       # Data models
│   │   ├── routing.py      # WebSocket URL routing
│   │   ├── tests.py        # Unit tests
│   │   └── views.py        # Views
│   ├── courses             # Courses application
│   │   ├── migrations      # Database migrations
│   │   ├── __init__.py
│   │   ├── admin.py        # Admin panel configuration
│   │   ├── apps.py         # App configuration
│   │   ├── filters.py      # Filters for Courses
│   │   ├── models.py       # Data models
│   │   ├── serializers.py  # Serializers for API
│   │   ├── tasks.py        # Celery tasks (e.g., sending notifications)
│   │   ├── tests.py        # Unit tests
│   │   ├── urls.py         # App-level URL configuration
│   │   └── views.py        # Views for API
│   ├── users               # Users application
│   │   ├── migrations      # Database migrations
│   │   ├── __init__.py
│   │   ├── admin.py        # Admin panel configuration
│   │   ├── apps.py         # App configuration
│   │   ├── filters.py      # Filters for Users
│   │   ├── models.py       # Data models (User model, StatusUpdate, Notification)
│   │   ├── serializers.py  # Serializers for API
│   │   ├── tests.py        # Unit tests
│   │   ├── urls.py         # App-level URL configuration
│   │   └── views.py        # Views for API
│   ├── Dockerfile          # Dockerfile for building the backend image
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   └── setup.py            # Script to seed the database with fake data
├── frontend                # React frontend application
│   ├── public              # Static assets
│   ├── src                 # React components and source code
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── Chat.tsx         # Chat Component
│   │   ├── Config.js        # Config component
│   │   ├── CourseList.tsx   # List of courses
│   │   ├── CoursePage.tsx   # Specific course page
│   │   ├── index.css
│   │   ├── index.tsx        # Entry point for the React app
│   │   ├── Login.tsx        # Login Component
│   │   ├── logo.svg
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Notifications.tsx  # Component for notifications
│   │   ├── react-app-env.d.ts
│   │   ├── Register.tsx     # Component for registration
│   │   ├── reportWebVitals.ts
│   │   ├── setupTests.ts
│   │   ├── types.ts         # Types for typescript
│   │   ├── useAxios.tsx     # Axios hook
│   │   ├── UserHomePage.tsx  # User homepage
│   │   └── UserList.tsx     # List of users
│   ├── Dockerfile          # Dockerfile for building the frontend image
│   ├── package-lock.json   # npm package lock file
│   ├── package.json        # npm package manifest
│   └── tsconfig.json       # TypeScript configuration
├── .envrc                  # Direnv configuration file
├── .gitignore              # Specifies intentionally untracked files that Git should ignore
├── default.nix             # Nix configuration file (optional, for Nix users)
├── docker-compose.yml      # Docker Compose configuration for running both frontend and backend
├── nginx.conf              # Nginx configuration for reverse proxy
└── README.md
```

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/bwfiq/elearning_app
    cd elearning_app
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```

3.  **Frontend Setup (in a separate shell):**

    ```bash
    cd frontend
    npm install
    npm start
    ```

4.  **Environment Variables:** Create a `.envrc` file (or set environment variables manually) with the following:

    ```
    export DJANGO_SECRET_KEY='your_django_secret_key' # Replace with a secure key
    export REDIS_HOST='localhost'         # Or the IP address of your Redis server
    export REDIS_PORT=6379
    export APP_URL='http://localhost:3000' # URL of your React App
    ```
5. Ensure `redis-server` is running, and run `celery` for asynchronous notifications:

   ```bash
   cd backend
   celery -A backend worker -l info
   ```   

## Database

This project uses SQLite for development, primarily for simplicity. SQLite is a file-based database that doesn't require a separate server process. It's suitable for development and small-scale deployments.

**Why SQLite?**

*   **Ease of Use:** No separate database server to install or configure.
*   **Development:** Simplifies local development setup.

## Backend Setup Script (setup.py)

The `backend/setup.py` script is provided to quickly populate your database with example data for development and testing.

**How to use it:**

1.  **Ensure the Django environment is set up:**  You've activated the virtual environment and installed the backend dependencies (as described in the setup instructions).

2.  **Run the script:**

    ```bash
    cd backend
    python setup.py
    cd ..
    ```

    This script will:

    *   Create a teacher user (`username=teacher`, `password=teacherpassword`).
    *   Create 5 student users (`username=student1` to `student5`, `password=studentpassword`).
    *   Create 3 courses, each with some materials and enrolled students.
    *   Generate feedback for each course from the enrolled students.

**Important:**

*   This script is mainly for development.  Do not run it in a production environment unless you intend to overwrite your existing data.
*   The script uses the `Faker` library to generate realistic-looking data.

## Docker

This project includes Dockerfiles for both the backend and frontend, enabling containerized deployment. The Dockerfiles have been optimized to reduce image size and build time.

### Dockerfile Optimizations

*   **Frontend:** The frontend image utilizes a multi-stage build. The first stage builds the React application, and the second stage copies only the static files (from `build` folder) to a lightweight Nginx server. This significantly reduces the final image size.
*   **Backend:** The backend image has been optimized by reducing the number of required packages, using alpine base image and combining RUN commands.

### Building the Docker Images

1.  **Backend:**

    ```bash
    cd backend
    docker build -t elearning-backend .
    cd ..
    ```

2.  **Frontend:**

    ```bash
    cd frontend
    docker build -t elearning-frontend .
    cd ..
    ```

### Running with Docker Compose

The `docker-compose.yml` file defines the services required to run the application. Please see the full configuration below in the section titled `docker-compose.yml`.

To run the application with Docker Compose:

1.  **Navigate to the project root directory:**

    ```bash
    cd <project_directory>
    ```

2.  **Run Docker Compose:**

    ```bash
    docker-compose up -d 
    ```

This command starts the containers defined in `docker-compose.yml`. The application will be accessible at `http://localhost:3000` (frontend) and `http://localhost:8000` (backend API).

## API Endpoints

The backend provides a RESTful API for managing users, courses, and other data. Here's a list of the available endpoints:

*   **User Management:**
    *   `GET /api/users/`: List all users (with filtering options).
    *   `POST /api/users/`: Create a new user (registration).
    *   `GET /api/users/<int:pk>/`: Get a specific user by ID.
    *   `PUT /api/users/<int:pk>/`: Update a specific user by ID.
    *   `DELETE /api/users/<int:pk>/`: Delete a specific user by ID.
    *   `GET /api/users/<int:user_id>/status_updates/`: List status updates for a user.
    *   `POST /api/users/<int:user_id>/status_updates/`: Create a new status update for a user.
    *   `GET /api/users/<int:user_id>/notifications/`: List notifications for a user.
    *   `PATCH /api/users/notifications/<int:notification_id>/mark_as_read/`: Mark a notification as read.
    *   `POST /api/register/`: Register a user.

*   **Authentication:**
    *   `POST /api/token/`: Obtain a JWT token.
    *   `POST /api/token/refresh/`: Refresh a JWT token.

*   **Course Management:**
    *   `GET /api/courses/`: List all courses (with filtering).
    *   `POST /api/courses/`: Create a new course (teachers only).
    *   `GET /api/courses/<int:pk>/`: Get a specific course by ID.
    *   `PUT /api/courses/<int:pk>/`: Update a specific course by ID (teachers only).
    *   `DELETE /api/courses/<int:pk>/`: Delete a specific course by ID (teachers only).
    *   `PATCH /api/courses/<int:pk>/enroll/`: Enroll/Unenroll in a course.
    *   `PATCH /api/courses/<int:pk>/remove_student/`: Remove a student from a course (teachers only).

*   **Course Materials:**
    *   `GET /api/courses/<int:course_id>/materials/`: List course materials.
    *   `POST /api/courses/<int:course_id>/materials/`: Create a new course material (teachers only).
    *   `GET /api/courses/<int:course_id>/materials/<int:pk>/`: Get a specific course material.
    *   `PUT /api/courses/<int:course_id>/materials/<int:pk>/`: Update a specific course material.
    *   `DELETE /api/courses/<int:course_id>/materials/<int:pk>/`: Delete a specific course material.

*   **Course Feedback:**
    *   `GET /api/courses/<int:course_id>/feedback/`: List course feedback.
    *   `POST /api/courses/<int:course_id>/feedback/`: Create new course feedback.

## Deployment

This project is already deployed at:

*   **Frontend:** [https://elearning.bwfiq.com](https://elearning.bwfiq.com)
*   **Backend API:** [https://elearningapi.bwfiq.com](https://elearningapi.bwfiq.com)

The live site is deployed on a Debian server using Docker Compose, similar to the setup described above. The database is pre-seeded with the fake data using `backend/setup.py`.

**Admin Credentials:**

*   **Username:** admin
*   **Password:** admin

## nginx.conf

```nginx
# Frontend Server Block
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name elearning.bwfiq.com;

    location / {
        # Setting the variables like this prevents nginx
        # from crashing if the host is unreachable.
        # proxy_pass http://app:port would crash nginx 
        # if the service was down, but now it gives a 502
        set $upstream_app elearning_app_frontend;
        set $upstream_port 3000;
        set $upstream_proto http;
        proxy_pass $upstream_proto://$upstream_app:$upstream_port;
    }
}

# Backend Server Block
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name elearningapi.bwfiq.com;

    location / {
        set $upstream_app elearning_app_backend;
        set $upstream_port 8000;
        set $upstream_proto http;
        proxy_pass $upstream_proto://$upstream_app:$upstream_port;
    }

    location /ws/ {
        # Points to daphne which we set to 8001
        set $upstream_app elearning_app_backend;
        set $upstream_port 8001;
        set $upstream_proto http;
        proxy_pass $upstream_proto://$upstream_app:$upstream_port;
    }
}
```

## docker-compose.yml

```yaml
services:
  redis:
    container_name: elearning_app_redis
    image: "redis:latest"
    networks:
      - bridge

  backend:
    container_name: elearning_app_backend
    image: ghcr.io/rrvsh/elearning_app/elearning-backend
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
    image: ghcr.io/rrvsh/elearning_app/elearning-backend
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
    image: ghcr.io/rrvsh/elearning_app/elearning-frontend
    restart: always
    depends_on:
      - backend
    networks:
      - bridge

networks:
  bridge:
    driver: bridge
```
