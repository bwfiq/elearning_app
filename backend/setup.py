# backend/setup.py

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from courses.models import Course, CourseMaterial, CourseFeedback
from faker import Faker
import random

def populate_database():
    User = get_user_model()
    fake = Faker()

    # Create a teacher user
    teacher, created = User.objects.get_or_create(
        username='teacher',
        defaults={
            'full_name': 'Example Teacher',
            'email': 'teacher@example.com',
            'is_teacher': True,
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        teacher.set_password('teacherpassword')
        teacher.save()

    # Create 5 student users
    students = []
    for i in range(5):
        username = f'student{i+1}'
        student, created = User.objects.get_or_create(
            username=username,
            defaults={
                'full_name': fake.name(),
                'email': fake.email(),
            }
        )
        if created:
            student.set_password('studentpassword')
            student.save()
        students.append(student)

    # Create 3 courses
    courses = []
    for i in range(3):
        course_name = f'Course {i+1}'
        course, created = Course.objects.get_or_create(
            creator=teacher,
            name=course_name,
            defaults={
                'description': fake.paragraph(),
            }
        )
        if created:
            courses.append(course)

            # Enroll random students
            num_students_to_enroll = random.randint(1, len(students))
            students_to_enroll = random.sample(students, num_students_to_enroll)
            course.students.set(students_to_enroll)

            # Create course materials
            for j in range(2):
                CourseMaterial.objects.create(
                    course=course,
                    uploaded_by=teacher,
                    text_content=fake.text(max_nb_chars=200),
                )

    # Create feedback for courses
    for course in courses:
        for student in course.students.all():
            CourseFeedback.objects.create(
                course=course,
                user=student,
                text=fake.paragraph(),
            )

    print("Database populated with example data.")


if __name__ == "__main__":
    populate_database()
