from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    message = "Only admin users can perform this action."
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, 'role') and
            request.user.role == 'Admin'
        )


class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to allow admin access or owner access only.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin can access any object
        if hasattr(request.user, 'role') and request.user.role == 'Admin':
            return True
        
        # Check if object is the user themselves
        if hasattr(obj, 'id') and obj.id == request.user.id:
            return True
        
        # Check if object has an employee field (like assignments)
        if hasattr(obj, 'employee') and obj.employee.id == request.user.id:
            return True
        
        return False


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Admin users have full access, authenticated users have read-only access.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for admins
        return hasattr(request.user, 'role') and request.user.role == 'Admin'
