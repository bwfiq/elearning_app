# backend/courses/serializers.py
from rest_framework import serializers
from .models import Course, CourseMaterial

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('creator',)

class CourseEnrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['students']

class CourseMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseMaterial
        fields = '__all__'
        read_only_fields = ('course', 'uploaded_by', 'upload_date')
