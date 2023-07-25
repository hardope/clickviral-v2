from django.urls import path
from . import views

urlpatterns = [
     path('',views.AllUsers.as_view()),
     path('create/',views.CreateUser.as_view()),
     path('<int:pk>/',views.OneUser.as_view()),
     path('profile/',views.AllProfiles.as_view()),
     path('profile/<int:pk>/',views.OneProfile.as_view()),
     
]