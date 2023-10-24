from django.urls import path
from . import views

urlpatterns = [
    path('profile/<int:pk>/', views.OneProfile.as_view()),
    path('account/create', views.CreateProfile.as_view()),
    path('account/image/create', views.CreateImage.as_view()),
    path('reset/email', views.ResetEmail.as_view()),
    path('reset/password', views.ResetPassword.as_view()),
]