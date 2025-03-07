from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    full_name = models.CharField("Full Name", max_length=240, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    is_teacher = models.BooleanField(default=False)
    registration_date = models.DateField("Registration Date", auto_now_add=True)

    def __str__(self):
        return self.username