from django.test import TestCase
from users.models import User
from django.core.files.uploadedfile import SimpleUploadedFile

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