from django.urls import path
from . import views

urlpatterns = [
    path('account/<int:id>/<str:code>/', views.verify_account)
]