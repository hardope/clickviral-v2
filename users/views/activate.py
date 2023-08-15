from ..serializers import UserSerializer
from ..models import UserProfile
from django.http import HttpResponse
import uuid

def Activate(request, key):
    if request.user.is_authenticated or request.method != 'GET':
        return HttpResponse("<h1>Invalid Operation</h1>",status=400)
    try:
        if len(key) != 36:
            return HttpResponse("<h1>Invalid Key</h1>",status=404)
        user = UserProfile.objects.get(activation=uuid.UUID(key))
        if user.is_active:
            return HttpResponse("<h1>Account Already Activated</h1>",status=200)
        user.is_active = True
        user.save()
        return HttpResponse("<h1>Account Activated Successfully, Proceed To Login</h1>",status=200)
    except UserProfile.DoesNotExist:
        return HttpResponse("<h1>Invalid Key</h1>",status=404)