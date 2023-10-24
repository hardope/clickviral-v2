from django.shortcuts import render
from django.http import HttpResponse
from account.models import Profile, Account
from utils import decode

# Create your views here.

def verify_account(request, id, code):
    try:
        profile = Profile.objects.get(id=id)
    except:
        return HttpResponse("<h1>Invalid verification code!</h1>")
    account = Account.objects.get(user=profile)
    if str(account.activation_key) == code:
        profile.is_active = True
        profile.save()
        return HttpResponse("<h1>Account verified!. Proceed to login</h1>")
    else:
        return HttpResponse("<h1>Invalid verification code!</h1>")
    

def verify_email(request, code):
    try:
        data = decode(code)
        profile = Profile.objects.get(id=data['user_id'])
    except Exception as e:
        return HttpResponse(f"<h1>Invalid verification code! {e}</h1>")
    except:
        return HttpResponse("<h1>Invalid verification code!</h1>")
    if Profile.objects.filter(email=data['email']).exists():
        return HttpResponse("<h1>Email already in use!</h1>")
    profile.email = data['email']
    profile.save()
    return HttpResponse("<h1>Email verified!</h1>")


def verify_password(request, code):
    try:
        data = decode(code)
        profile = Profile.objects.get(id=data['user_id'])
    except Exception as e:
        return HttpResponse(f"<h1>Invalid verification code! {e}</h1>")
    except:
        return HttpResponse("<h1>Invalid verification code!</h1>")
    profile.set_password(data['password'])
    profile.save()
    return HttpResponse("<h1>Password reset!</h1>")