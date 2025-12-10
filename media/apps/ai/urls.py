from django.urls import path
from .views import analyze_prompt_view, chat_view
from .chat_views import chat_api

urlpatterns = [
    path('analyze-prompt/', analyze_prompt_view, name='analyze-prompt'),
    path('chat/', chat_api, name='chat_api'), # Replaced placeholder chat_view with actual API
]
