from django.urls import path
from . import views

urlpatterns = [
     path('',views.AllUsers.as_view(), name='all'),
     path('create',views.CreateUser.as_view(), name='create_user'),
     path('<int:pk>',views.OneUser.as_view(), name='one_user'),
     path('profile',views.AllProfiles.as_view(), name='all_profiles'),
     path('profile/<int:pk>',views.OneProfile.as_view(), name='one_profile'),
     path('auth',views.Auth.as_view(), name='auth'),
     
]