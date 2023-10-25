from django.urls import path
from . import views

urlpatterns = [
    path('profile/<int:pk>/', views.OneProfile.as_view()),
    path('create', views.CreateProfile.as_view()),
    path('profile/image/create', views.CreateImage.as_view()),
    path('reset/email', views.ResetEmail.as_view()),
    path('reset/password', views.ResetPassword.as_view()),
]