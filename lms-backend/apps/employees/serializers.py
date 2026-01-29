from rest_framework import serializers
from apps.authentication.models import User
from apps.authentication.serializers import UserSerializer, UserCreateSerializer, UserUpdateSerializer


# Re-use the same serializers from authentication app
class EmployeeSerializer(UserSerializer):
    """Alias for UserSerializer for employee context."""
    pass


class EmployeeCreateSerializer(UserCreateSerializer):
    """Alias for UserCreateSerializer for employee context."""
    pass


class EmployeeUpdateSerializer(UserUpdateSerializer):
    """Alias for UserUpdateSerializer for employee context."""
    pass
