from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrbitViewSet, prompt_view, create_orbit_view, orbit_progress_view, orbit_results_view, semi_auto_create_view, semi_auto_builder_view, semi_auto_next_view, history_list_view, download_orbit_view, github_push_view
from .tools_views import ToolsRecommendView, ToolsValidateView, ToolsSaveView

router = DefaultRouter()
router.register(r'api', OrbitViewSet) # Moved API to /api/orbits/api/ or just /api/orbits/

urlpatterns = [
    path('prompt/', prompt_view, name='prompt'),
    path('create/', create_orbit_view, name='create_orbit'),
    path('<uuid:orbit_id>/progress/', orbit_progress_view, name='orbit_progress'),
    path('<uuid:orbit_id>/results/', orbit_results_view, name='orbit_results'),
    path('<uuid:orbit_id>/download/', download_orbit_view, name='orbit_download'),
    path('<uuid:orbit_id>/push/', github_push_view, name='github_push'),
    path('create/semi-auto/', semi_auto_create_view, name='create_semi_auto'),
    path('<uuid:orbit_id>/builder/', semi_auto_builder_view, name='semi_auto_builder'),
    path('<uuid:orbit_id>/builder/next/', semi_auto_next_view, name='semi_auto_next'),
    
    # Tools Selection API
    path('api/tools/recommend/', ToolsRecommendView.as_view(), name='tools_recommend'),
    path('api/tools/validate/', ToolsValidateView.as_view(), name='tools_validate'),
    path('api/tools/save/', ToolsSaveView.as_view(), name='tools_save'),
    
    path('history/', history_list_view, name='history_list'),
    
    path('', include(router.urls)),


]
