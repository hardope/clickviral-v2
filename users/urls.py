from django.urls import path
from . import views

urlpatterns = [
     path('',views.AllUsers.as_view()),
     path('create/',views.CreateUser.as_view()),
     path('one/<int:pk>/',views.OneUser.as_view()),
]