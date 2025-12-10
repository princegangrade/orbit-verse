from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Pipeline

def manual_builder_view(request):
    return render(request, 'manual_builder.html')

@api_view(['POST'])
def save_pipeline_api(request):
    # Logic to save pipeline
    return Response({'status': 'saved'})


# Create your views here.
