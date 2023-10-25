from django.shortcuts import render
from django.http import HttpResponse
from account.models import Profile
from utils import decode

# Create your views here.

def verify_account(request, token):

    try:
        data = decode(token)
        profile = Profile.objects.get(id=data['user_id'], email=data['email'])
    except:
        return HttpResponse("<h1>Invalid verification Token!</h1>")
    
    profile.is_active = True
    profile.save()
    return HttpResponse("<h1>Account verified!</h1>")

def verify_email(request, token):
    try:
        data = decode(token)
        profile = Profile.objects.get(id=data['user_id'])
    except:
        return HttpResponse("<h1>Invalid verification Token!</h1>")
    if Profile.objects.filter(email=data['email']).exists():
        return HttpResponse("<h1>Email already in use!</h1>")
    profile.email = data['email']
    profile.save()
    return HttpResponse("<h1>Email verified!</h1>")


def verify_password(request, token):
    try:
        data = decode(token)
        profile = Profile.objects.get(id=data['user_id'])
    except:
        return HttpResponse("<h1>Invalid verification Token!</h1>")
    profile.set_password(data['password'])
    profile.save()
    return HttpResponse("<h1>Password reset!</h1>")