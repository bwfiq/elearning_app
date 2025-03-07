# cm3035-elearning-app

This will be a web app that serves an elearning application. The backend will be a CRUD API built with Django and serve data to a React frontend.

## Features

- Users should be able to:
  - create new password-secured accounts
  - be of either students or teachers with corresponding permissions
  - store appropriate personal information such as username, real name, photo,
    etc
  - have a home page that is discoverable to other users and shows:
    - user information
    - registered courses
    - upcoming deadlines
    - status updates
  - view a page that uses web sockets to enable real time chat
- students should be able to:
  - leave feedback for particular courses
  - see a list of available courses
  - select the courses they want to enrol to
  - get notified when material is added to a course they are enrolled to
- teachers should be able to:
  - search for students and other teachers
  - create courses and upload course material
  - view their course pages and see list of students enrolled in the course
  - remove students from their courses
  - get notified when a student enrolls in one of their courses
- An appropriate REST interface for all data should be provided

## Technical Specifications

- The app will be a Single Page Application built with Django. It will make
  appropriate use of:
  - models and migrations (using an appropriate database model for accoutns,
    stored data, and the relationships between accounts)
  - form, validators, and serialisation
  - django-rest-framework
  - URL routing
  - unit testing for both client and server side code
- The app will be Dockerised.
- This repository will make use of GitHub Actions for CI/CD.

### API Endpoints

The backend provides a REST API for managing users, courses, and course materials.  Below is a summary of the planned endpoints:

**Users:**

*   `GET /api/users/`: Retrieve a list of all users.
*   `POST /api/users/`: Create a new user.
*   `GET /api/users/{user_id}/`: Retrieve details of a specific user.
*   `PUT /api/users/{user_id}/`: Update an existing user.
*   `DELETE /api/users/{user_id}/`: Delete a user.
*   `POST /api/register/`: Register a new user account.
*   `POST /api/login/`: Authenticate a user and obtain a token.
*   `POST /api/logout/`: Invalidate a user's token.
*   `GET /api/users/{user_id}/home/`: Retrieve home page data for a specific user.
*   `GET /api/users/{user_id}/profile/`: Retrieve profile information for a specific user.
*   `PUT /api/users/{user_id}/profile/`: Update profile information for a specific user.

**Courses:**

*   `GET /api/courses/`: Retrieve a list of all courses.
*   `POST /api/courses/`: Create a new course (teacher access only).
*   `GET /api/courses/{course_id}/`: Retrieve details of a specific course.
*   `PUT /api/courses/{course_id}/`: Update an existing course (teacher access only).
*   `DELETE /api/courses/{course_id}/`: Delete a course (teacher access only).
*   `GET /api/courses/{course_id}/students/`: Retrieve a list of students enrolled in a course.
*   `POST /api/courses/{course_id}/students/`: Enroll a student in a course.
*   `DELETE /api/courses/{course_id}/students/{student_id}/`: Remove a student from a course (teacher access only).
*   `GET /api/courses/available/`: Retrieve a list of courses available for enrollment.

**Course Materials:**

*   `GET /api/courses/{course_id}/materials/`: Retrieve a list of materials for a course.
*   `POST /api/courses/{course_id}/materials/`: Upload new material for a course (teacher access only).
*   `GET /api/courses/{course_id}/materials/{material_id}/`: Retrieve details of a specific material.
*   `PUT /api/courses/{course_id}/materials/{material_id}/`: Update an existing material (teacher access only).
*   `DELETE /api/courses/{course_id}/materials/{material_id}/`: Delete a material (teacher access only).

**Feedback:**

*   `GET /api/courses/{course_id}/feedback/`: Retrieve a list of feedback for a course.
*   `POST /api/courses/{course_id}/feedback/`: Submit feedback for a course.
*   `GET /api/feedback/{feedback_id}/`: Retrieve a specific feedback entry.
*   `PUT /api/feedback/{feedback_id}/`: Update a feedback entry.
*   `DELETE /api/feedback/{feedback_id}/`: Delete a feedback entry.

**Deadlines/Assignments:**

*   `GET /api/courses/{course_id}/deadlines/`: Retrieve a list of deadlines for a course.
*   `POST /api/courses/{course_id}/deadlines/`: Create a new deadline (teacher access only).
*   `GET /api/deadlines/{deadline_id}/`: Retrieve details of a specific deadline.
*   `PUT /api/deadlines/{deadline_id}/`: Update an existing deadline (teacher access only).
*   `DELETE /api/deadlines/{deadline_id}/`: Delete a deadline (teacher access only).

**Search:**

*   `GET /api/search/users/?q={query}`: Search for users.
*   `GET /api/search/courses/?q={query}`: Search for courses.

**WebSockets:**

*   `ws://{domain}/ws/chat/{room_name}/`: WebSocket endpoint for real-time chat (requires Django Channels).

### Dependencies

This project was developed with:

- OS: Linux
- Python 3.12.9
- Django 5.1.6
- django-cors-headers 4.7.0
- djangorestframework 3.15.2

## Setup

### Development Environment

#### Using Python venv

1. Clone the repository: `git clone https://github.com/bwfiq/elearning_app.git`
2. Create a virtual environment: `python3 -m venv venv` (or
   `python -m venv venv` if python3 is not default)
3. Activate the virtual environment:
   - Linux/macOS: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`
4. Install dependencies: `pip install -r requirements.txt`

#### Using nix-shell

1. Clone the repository: `git clone https://github.com/bwfiq/elearning_app.git`
2. Run the development shell with
   `nix-shell --extra-experimental-features "nix-command flakes"`

#### Using direnv

1. Clone the repository: `git clone https://github.com/bwfiq/elearning_app.git`
2. Run the command `direnv allow .` to enable loading the .envrc.
3. All dependencies will be set up when entering the project directory.

#### Node Dependencies

1. Clone the repository: `git clone https://github.com/bwfiq/elearning_app.git`
2. Run the command `npm install` to install the node dependencies.

### Project Setup

Run the following commands to set up the database and run the development
server:

```sh
# Running the backend
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0:8000 # To listen on port 8000 on the LAN

# Running the frontend
cd frontend
npm start
```

## Acknowledgements

- https://blog.logrocket.com/using-react-django-create-app-tutorial/ for
  providing much of the startup code for this project
