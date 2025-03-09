# /backend/courses/serializers.py
from rest_framework import serializers
from .models import Course, CourseMaterial, CourseFeedback

class CourseSerializer(serializers.ModelSerializer):
    creator_username = serializers.ReadOnlyField(source='creator.username')
    
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('creator',)

class CourseEnrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['students']

class CourseMaterialSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.SerializerMethodField()

    class Meta:
        model = CourseMaterial
        fields = '__all__'
        read_only_fields = ('course', 'uploaded_by', 'upload_date', 'uploaded_by_username')

    def get_uploaded_by_username(self, obj):
        return obj.uploaded_by.username if obj.uploaded_by else None

class CourseFeedbackSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')  # Display username instead of pk
    class Meta:
        model = CourseFeedback
        fields = '__all__'
        read_only_fields = ('course', 'timestamp')

class CourseRemoveStudentSerializer(serializers.Serializer):
    student_id = serializers.IntegerField(required=True)
