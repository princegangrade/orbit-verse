from celery import shared_task
from .models import Orbit
from apps.ai.gemini_client import generate_project
import asyncio

@shared_task
def generate_project_task(orbit_id, prompt, context=""):
    try:
        orbit = Orbit.objects.get(id=orbit_id)
    except Orbit.DoesNotExist:
        return # Should not happen if id passed correctly

    orbit.status = 'processing'
    orbit.save()
    
    try:
        result = asyncio.run(generate_project(prompt, context))
        orbit.artifacts = {
            'files': result['files'],
            'explanation': result['explanation']
        }
        orbit.status = 'completed'
        orbit.save()
    except Exception as e:
        orbit.status = 'failed'
        orbit.artifacts = orbit.artifacts or {}
        orbit.artifacts['error'] = str(e)
        orbit.save()
        # We can log the exception here
        print(f"Error generating project for orbit {orbit_id}: {e}")
