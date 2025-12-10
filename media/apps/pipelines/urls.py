from django.urls import path
from .views import manual_builder_view, save_pipeline_api

urlpatterns = [
    path('builder/', manual_builder_view, name='manual_builder'),
    path('api/save/', save_pipeline_api, name='save_pipeline'),
]
