from rest_framework import serializers
from .models import User, StatusUpdate


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ("pk", "username", "full_name", "email", "is_teacher", "registration_date", "password", "profile_picture")
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class StatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusUpdate
        fields = ('id', 'user', 'text', 'timestamp')
        read_only_fields = ('id', 'user', 'timestamp')
