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

**Users App:**

*   `/api/users/`: User list, creation, details, update, deletion.
*   `/api/register/`: User registration.
*   `/api/users/{user_id}/`: User data and home page data.

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
2. Go to the frontend directory: `cd frontend/`
3. Run the command `npm install` to install the node dependencies.

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
