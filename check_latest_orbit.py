
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
    # Fetch the last created orbit
    orbit = Orbit.objects.order_by('-created_at').first()
    if orbit:
        print(f"--- Latest Orbit ---")
        print(f"ID: {orbit.id}")
        print(f"Created (UTC): {orbit.created_at}")
        print(f"Status: {orbit.status}")
        print(f"Prompt: {orbit.prompt}")
        # print(f"Description: {orbit.description}") # field might not exist
        details = json.dumps(orbit.artifacts, indent=2)
        print(f"Artifacts: {details}") 
    else:
        print("No orbits found.")
except Exception as e:
    print(f"Error querying database: {e}")
