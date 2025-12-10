from django.urls import path
from .views import github_login, github_callback, push_to_github

urlpatterns = [
    path('login/', github_login, name='github_login'),
    path('callback/', github_callback, name='github_callback'),
    path('push/<uuid:orbit_id>/', push_to_github, name='github_push'),
]
