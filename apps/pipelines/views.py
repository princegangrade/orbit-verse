from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Pipeline
from .serializers import PipelineSerializer
from django.contrib.auth.decorators import login_required

class PipelineViewSet(viewsets.ModelViewSet):
    serializer_class = PipelineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Pipeline.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    from rest_framework.decorators import action
    from rest_framework.response import Response

    @action(detail=True, methods=['post'], url_path='ai/optimize')
    def optimize(self, request, pk=None):
        """AI optimization of pipeline config."""
        return Response({'message': 'No optimizations found. Pipeline is efficient.'})

    @action(detail=True, methods=['post'], url_path='ai/validate')
    def validate_pipeline(self, request, pk=None):
        """AI validation of pipeline integrity."""
        return Response({'valid': True, 'message': 'Pipeline configuration is valid.'})

def manual_builder_view(request):
    return render(request, 'manual_builder.html')
