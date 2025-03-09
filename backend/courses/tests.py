from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Course

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
