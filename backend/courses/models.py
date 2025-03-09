from django.db import models
from django.conf import settings

class Course(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_courses')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='enrolled_courses', blank=True)

    def __str__(self):
        return self.name

    def remove_student(self, student):
        if student in self.students.all():
            self.students.remove(student)
            return True
        return False


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

class CourseFeedback(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='feedback')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback by {self.user.username} on {self.course.name}"
