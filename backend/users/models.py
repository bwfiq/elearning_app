from django.db import models


class User(models.Model):
    username = models.CharField("Username", max_length=240)
    fullName = models.CharField("Full Name", max_length=240)
    email = models.EmailField()
    registrationDate = models.DateField("Registration Date", auto_now_add=True)
    # TODO: Add following fields:
    # isTeacher
    # profilePicture
    # password

    def __str__(self):
        return self.username
