# backend/users/tests.py

from django.test import TestCase
from users.models import User, StatusUpdate
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class UserModelTests(TestCase):
    def test_user_fields(self):
        # Create a user with all fields
        image = SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")
        user = User.objects.create(
            username="testuser",
            full_name="Test User",
            email="test@example.com",
            profile_picture=image,
            is_teacher=True,
        )

        # Assert that the fields are set correctly
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.full_name, "Test User")
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.is_teacher, True)
        self.assertIsNotNone(user.registration_date)  # Check that it's set

        # Optionally, check the profile picture file name
        self.assertTrue(user.profile_picture.name.startswith('profile_pics/test_image'))

class UserAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword', full_name='Test User', email='test@example.com')

    def test_get_user_details(self):
        url = reverse('users_list') + '?username=testuser'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1) # Expecting a list with one user
        self.assertEqual(response.data[0]['username'], 'testuser')
        self.assertEqual(response.data[0]['full_name'], 'Test User')
        self.assertEqual(response.data[0]['email'], 'test@example.com')

    def test_get_user_details_not_found(self):
        url = reverse('users_list') + '?username=nonexistentuser'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)  # User not found should return 404
        self.assertEqual(response.data, []) # Returns an empty list

    def test_get_user_details_by_pk(self):
        url = reverse('users_list') + f'?pk={self.user.pk}'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'testuser')
        self.assertEqual(response.data[0]['full_name'], 'Test User')
        self.assertEqual(response.data[0]['email'], 'test@example.com')

    def test_get_user_details_by_pk_not_found(self):
        url = reverse('users_list') + '?pk=999'  # Non-existent pk
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, [])

class StatusUpdateAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword', full_name='Test User', email='test@example.com')
        self.token = self.get_token_for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def get_token_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def test_create_status_update(self):
        url = reverse('user_status_updates', kwargs={'user_id': self.user.pk})
        data = {'text': 'This is a test status update.'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(StatusUpdate.objects.count(), 1)
        self.assertEqual(StatusUpdate.objects.first().text, 'This is a test status update.')
        self.assertEqual(StatusUpdate.objects.first().user, self.user)

    def test_get_status_updates(self):
        # Create some status updates for the user
        StatusUpdate.objects.create(user=self.user, text='First update')
        StatusUpdate.objects.create(user=self.user, text='Second update')

        url = reverse('user_status_updates', kwargs={'user_id': self.user.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['text'], 'Second update')  # Newest first
        self.assertEqual(response.data[1]['text'], 'First update')
