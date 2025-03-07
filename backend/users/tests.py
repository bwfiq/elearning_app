from django.test import TestCase
from users.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from django.urls import reverse

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

