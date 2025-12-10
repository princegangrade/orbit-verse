from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PipelineViewSet, manual_builder_view

router = DefaultRouter()
router.register(r'api', PipelineViewSet, basename='pipeline')

urlpatterns = [
    path('', manual_builder_view, name='manual_builder'),
    path('', include(router.urls)),
]
