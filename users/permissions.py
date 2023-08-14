from rest_framework import permissions

class IsUserOrReadOnly(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        
        if request.method in permissions.SAFE_METHODS:
            return True

        attribute = getattr(obj, 'user', None)

        if attribute:
            return obj.user == request.user

        return obj.id == request.user.id
