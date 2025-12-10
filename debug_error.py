
import os
import django
import json
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'orbitverse.settings')
django.setup()

from apps.orbits.models import Orbit

try:
    orbit = Orbit.objects.filter(status='failed').order_by('-updated_at').first()
    if orbit:
        print(f"ID: {orbit.id}")
        error = orbit.artifacts.get('error', 'No error key found')
        print(f"Error Message: {error}")
    else:
        print("No failed orbits.")
except Exception as e:
    print(f"Check failed: {e}")
