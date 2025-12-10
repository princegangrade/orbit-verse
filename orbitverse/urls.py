from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from apps.users.dashboard_views import dashboard_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', dashboard_view, name='home'),
    path('welcome/', TemplateView.as_view(template_name='welcome.html'), name='welcome'),
    path('orbits/', include('apps.orbits.urls')),

    path('pipelines/', include('apps.pipelines.urls')),
    path('auth/', include('apps.users.urls')),
    path('github/', include('apps.github.urls')),
    path('api/ai/', include('apps.ai.urls')),
    
    path('api/sdlc/', include('apps.sdlc.urls')),



]
