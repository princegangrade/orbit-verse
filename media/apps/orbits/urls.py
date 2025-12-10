from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrbitViewSet, prompt_view, create_orbit_view, orbit_progress_view, orbit_results_view, semi_auto_create_view, semi_auto_builder_view, semi_auto_next_view

router = DefaultRouter()
router.register(r'api', OrbitViewSet) # Moved API to /api/orbits/api/ or just /api/orbits/

urlpatterns = [
    path('prompt/', prompt_view, name='prompt'),
    path('create/', create_orbit_view, name='create_orbit'),
    path('<uuid:orbit_id>/progress/', orbit_progress_view, name='orbit_progress'),
    path('<uuid:orbit_id>/results/', orbit_results_view, name='orbit_results'),
    path('create/semi-auto/', semi_auto_create_view, name='create_semi_auto'),
    path('<uuid:orbit_id>/builder/', semi_auto_builder_view, name='semi_auto_builder'),
    path('<uuid:orbit_id>/builder/next/', semi_auto_next_view, name='semi_auto_next'),
    path('', include(router.urls)),


]
