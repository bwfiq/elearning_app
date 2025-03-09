from django.db import models
from django.conf import settings

class Course(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_courses')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='enrolled_courses', blank=True)

    def __str__(self):
        return self.name
