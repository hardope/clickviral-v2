from django.urls import path
from . import views

urlpatterns = [
    path('account/<int:id>/<str:code>/', views.verify_account),
    path('email/<str:code>/', views.verify_email),
    path('password/<str:code>/', views.verify_password),
]