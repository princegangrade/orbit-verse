
import os
import django
import json
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'orbitverse.settings')
django.setup()

from apps.orbits.models import Orbit
from apps.users.models import User
from apps.orbits.tasks import generate_project_task

try:
    # Get or create a user
    user = User.objects.first()
    if not user:
        user = User.objects.create_user(username='admin', email='admin@example.com', password='adminpassword')
        print("Created admin user.")

    prompt_text = "A simple todo list app"
    
    print(f"Creating Orbit with prompt: {prompt_text}")
    orbit = Orbit.objects.create(user=user, prompt=prompt_text)
    print(f"Orbit created with ID: {orbit.id}")
    
    # Trigger task (synchrounous because EAGER is True)
    print("Triggering generation task...")
    generate_project_task.delay(orbit.id, prompt_text)
    print("Generation task completed (or queued if not eager).")
    
    # Refresh orbit
    orbit.refresh_from_db()
    print(f"Orbit Status: {orbit.status}")
    if orbit.status == 'failed':
         print(f"Error: {orbit.artifacts.get('error')}")
    else:
         print(f"Artifacts keys: {list(orbit.artifacts.keys())}")

except Exception as e:
    print(f"Error: {e}")
