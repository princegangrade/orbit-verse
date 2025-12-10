# apps/ai/urls.py
from django.urls import path
from .views import generate_project_view, health_view, analyze_prompt_view, chat_view, project_tree_view

urlpatterns = [
    path('generate/', generate_project_view, name='ai-generate'),
    path('analyze-prompt/', analyze_prompt_view, name='ai-analyze-prompt'),
    path('chat/', chat_view, name='ai-chat'),
    path('project-tree/', project_tree_view, name='ai-project-tree'),
    path('health/', health_view, name='ai-health'),
]