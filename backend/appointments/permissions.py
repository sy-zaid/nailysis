from rest_framework import permissions

class IsClinicAdmin(permissions.BasePermission):
    """
    Custom permission to grant access only to clinic admins.
    """

    def has_permission(self, request, view):
        # User must be authenticated and have the "clinic_admin" role
        return request.user.is_authenticated and request.user.role == "clinic_admin"