from django.shortcuts import render
from django.http import HttpResponse
from account.models import Profile, Account
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