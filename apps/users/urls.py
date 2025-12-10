from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import register_view, login_view, logout_view, UserViewSet

router = DefaultRouter()
router.register(r'api', UserViewSet, basename='user')

urlpatterns = [
    # Auth Views
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    
    # API Routes
    path('', include(router.urls)),
]
