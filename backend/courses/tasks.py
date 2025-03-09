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

@shared_task
def send_unenrollment_notification(user_id, course_name):
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    message = f"You have been un-enrolled from the course: {course_name}."
    Notification.objects.create(user=user, message=message)

@shared_task
def send_removal_notification(user_id, course_name):
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    message = f"You have been removed from the course: {course_name}."
    Notification.objects.create(user=user, message=message)

@shared_task
def send_new_material_notification(user_id, course_name, material_name):
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    message = f"New material '{material_name}' has been added to the course: {course_name}."
    Notification.objects.create(user=user, message=message)

@shared_task
def send_teacher_enrollment_notification(teacher_id, student_username, course_name):
    User = get_user_model()
    teacher = User.objects.get(pk=teacher_id)
    message = f"Student '{student_username}' has enrolled in your course: {course_name}."
    Notification.objects.create(user=teacher, message=message)
