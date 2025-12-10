from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SDLCNoteViewSet

router = DefaultRouter()
router.register(r'notes', SDLCNoteViewSet, basename='sdlc-note')

urlpatterns = [
    path('', include(router.urls)),
]
