import json
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from users.models import User
from users.serializers import UserSerializer


# initialize the APIClient app
client = Client()


class UserTests(TestCase):
    """ Test module for User model """

    def setUp(self):
        User.objects.all().delete()
        self.silverjoe = User.objects.create(username='silverjoe', fullName='Joe Silver', email='joe@email.com')
        self.bobbybrown = User.objects.create(username='bobbybrown', fullName='Bobby Brown', email='bobby@email.com')

    def test_user_creation(self):
        silverjoe = User.objects.get(username='silverjoe')
        bobbybrown = User.objects.get(username='bobbybrown')
        self.assertEqual(silverjoe.fullName, "Joe Silver")
        self.assertEqual(bobbybrown.email, "bobby@email.com")

class GetAllUsersTest(TestCase):
    """ Test module for GET all users API """

    def setUp(self):
        User.objects.all().delete()
        User.objects.create(username='silverjoe', fullName='Joe Silver', email='joe@email.com')
        User.objects.create(username='bobbybrown', fullName='Bobby Brown', email='bobby@email.com')
        User.objects.create(username='goldengate', fullName='Golden Gate', email='golden@email.com')
        User.objects.create(username='blackburn', fullName='Black Burn', email='black@email.com')

    def test_get_all_users(self):
        # get API response
        response = client.get(reverse('users_list'))
        # get data from db
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class GetSingleUserTest(TestCase):
    """ Test module for GET single user API """

    def setUp(self):
        User.objects.all().delete()
        self.silverjoe = User.objects.create(username='silverjoe', fullName='Joe Silver', email='joe@email.com')
        self.bobbybrown = User.objects.create(username='bobbybrown', fullName='Bobby Brown', email='bobby@email.com')
        self.goldengate = User.objects.create(username='goldengate', fullName='Golden Gate', email='golden@email.com')
        self.blackburn = User.objects.create(username='blackburn', fullName='Black Burn', email='black@email.com')

    def test_get_valid_single_user(self):
        response = client.get(
            reverse('users_detail', args=[self.bobbybrown.pk]))
        user = User.objects.get(pk=self.bobbybrown.pk)
        serializer = UserSerializer(user)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_user(self):
        response = client.get(
            reverse('users_detail', args=[30]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreateNewUserTest(TestCase):
    """ Test module for creating a new user """

    def setUp(self):
        User.objects.all().delete()
        self.valid_payload = {
            'username': 'validname',
            'fullName': 'Valid Name',
            'email': 'valid@email.com'
        }
        self.invalid_payload = {
            'username': '',
            'fullName': 'Valid Name',
            'email': 'valid@email.com'
        }

    def test_create_valid_user(self):
        response = client.post(
            reverse('users_list'),
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_user(self):
        response = client.post(
            reverse('users_list'),
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UpdateSingleUserTest(TestCase):
    """ Test module for updating an existing user """

    def setUp(self):
        self.silverjoe = User.objects.create(username='silverjoe', fullName='Joe Silver', email='joe@email.com')
        self.bobbybrown = User.objects.create(username='bobbybrown', fullName='Bobby Brown', email='bobby@email.com')
        self.valid_payload = {
            'username': 'validname',
            'fullName': 'Valid Name',
            'email': 'valid@email.com'
        }
        self.invalid_payload = {
            'username': '',
            'fullName': 'Valid Name',
            'email': 'valid@email.com'
        }

    def test_valid_update_user(self):
        response = client.put(
            reverse('users_detail', args=[self.bobbybrown.pk]),
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_update_user(self):
         response = client.put(
            reverse('users_detail', args=[self.bobbybrown.pk]),
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class DeleteSingleUserTest(TestCase):
    """ Test module for deleting an existing user """

    def setUp(self):
        User.objects.all().delete()
        self.silverjoe = User.objects.create(username='silverjoe', fullName='Joe Silver', email='joe@email.com')
        self.bobbybrown = User.objects.create(username='bobbybrown', fullName='Bobby Brown', email='bobby@email.com')

    def test_valid_delete_user(self):
        response = client.delete(
            reverse('users_detail', args=[self.bobbybrown.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_user(self):
        response = client.delete(
            reverse('users_detail', args=[30]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
