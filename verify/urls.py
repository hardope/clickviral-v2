from django.urls import path
from . import views

urlpatterns = [
    path('account/<str:token>/', views.verify_account),
    path('email/<str:token>/', views.verify_email),
    path('password/<str:token>/', views.verify_password),
]