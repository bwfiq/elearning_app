# cm3035-elearning-app

This will be an app built with Django that serves an elearning application.

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

### Project Setup

Run the following commands to set up the database and run the development
server:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000 # To listen on port 8000 on the LAN
```
