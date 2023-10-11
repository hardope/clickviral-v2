from django.urls import path
from . import views

urlpatterns = [
    path('profile/<int:pk>/', views.OneProfile.as_view()),
    path('account/create', views.CreateProfile.as_view()),
]