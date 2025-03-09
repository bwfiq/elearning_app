# backend/courses/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Course, CourseMaterial
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()

class CourseAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@example.com', full_name='Test User')
        self.teacher = User.objects.create_user(username='teacher', password='testpassword', email='teacher@example.com', full_name='Test Teacher', is_teacher=True)

        # Obtain token for the user
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': 'testpassword'})
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Obtain token for the teacher
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'teacher', 'password': 'testpassword'})
        self.teacher_token = response.data['access']

    def test_create_course(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.teacher_token)
        url = reverse('course-list-create')
        data = {'name': 'Test Course', 'description': 'Test description'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 1)
        self.assertEqual(Course.objects.first().name, 'Test Course')
        self.assertEqual(Course.objects.first().creator, self.teacher)

    def test_get_course_list(self):
        Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        url = reverse('course-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_course_detail(self):
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        url = reverse('course-retrieve-update-destroy', kwargs={'pk': course.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Course')

    def test_update_course(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.teacher_token)
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        url = reverse('course-retrieve-update-destroy', kwargs={'pk': course.pk})
        data = {'name': 'Updated Course', 'description': 'Updated description'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Course.objects.first().name, 'Updated Course')

    def test_delete_course(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.teacher_token)
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        url = reverse('course-retrieve-update-destroy', kwargs={'pk': course.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Course.objects.count(), 0)

    def test_course_creation_permission(self):
       self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
       url = reverse('course-list-create')
       data = {'name': 'Test Course', 'description': 'Test description'}
       response = self.client.post(url, data, format='json')
       self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_course_update_permission(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        url = reverse('course-retrieve-update-destroy', kwargs={'pk': course.pk})
        data = {'name': 'Updated Course', 'description': 'Updated description'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_course_deletion_permission(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        url = reverse('course-retrieve-update-destroy', kwargs={'pk': course.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_enroll_course(self):
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        url = reverse('course-enroll', kwargs={'pk': course.pk})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(course.students.count(), 1)
        self.assertEqual(course.students.first(), self.user)
        self.assertEqual(response.data['status'], 'enrolled')

    def test_unenroll_course(self):
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        course.students.add(self.user)
        url = reverse('course-enroll', kwargs={'pk': course.pk})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(course.students.count(), 0)
        self.assertEqual(response.data['status'], 'un enrolled')

    def test_enroll_course_unauthenticated(self):
        self.client.credentials()  # Remove authentication
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        url = reverse('course-enroll', kwargs={'pk': course.pk})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_course_material(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.teacher_token)
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        url = reverse('course-material-list-create', kwargs={'course_id': course.pk})
        data = {'text_content': 'Test material'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CourseMaterial.objects.count(), 1)
        self.assertEqual(CourseMaterial.objects.first().text_content, 'Test material')
        self.assertEqual(CourseMaterial.objects.first().course, course)
        self.assertEqual(CourseMaterial.objects.first().uploaded_by, self.teacher)

    def test_get_course_materials(self):
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        CourseMaterial.objects.create(course=course, text_content='Test material', uploaded_by=self.teacher)
        url = reverse('course-material-list-create', kwargs={'course_id': course.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['text_content'], 'Test material')

    def test_create_course_material_permission(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        url = reverse('course-material-list-create', kwargs={'course_id': course.pk})
        data = {'text_content': 'Test material'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_upload_file_to_course(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.teacher_token)
        course = Course.objects.create(name='Test Course', description='Test description', creator=self.teacher)
        url = reverse('course-material-list-create', kwargs={'course_id': course.pk})
        file_mock = SimpleUploadedFile("test.txt", b"file content", content_type="text/plain")
        data = {'file': file_mock}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CourseMaterial.objects.count(), 1)
        self.assertEqual(CourseMaterial.objects.first().course, course)
        self.assertEqual(CourseMaterial.objects.first().uploaded_by, self.teacher)
        self.assertTrue(CourseMaterial.objects.first().file.name.startswith('course_materials/test'))
