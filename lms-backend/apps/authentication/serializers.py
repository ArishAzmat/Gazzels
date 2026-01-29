from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model (without password).
    """
    class Meta:
        model = User
        fields = [
            'id', 'employee_code', 'email', 'name', 'department',
            'role', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating users (includes password).
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'id', 'employee_code', 'email', 'name', 'department',
            'role', 'password', 'password_confirm'
        ]
        read_only_fields = ['id']
    
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating users (without password).
    """
    class Meta:
        model = User
        fields = ['name', 'department', 'is_active']


class LoginSerializer(serializers.Serializer):
    """
    Serializer for login credentials.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})


class TokenSerializer(serializers.Serializer):
    """
    Serializer for token response.
    """
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()
