
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
    # Fetch the last 2 failed orbits
    failed_orbits = Orbit.objects.filter(status='failed').order_by('-updated_at')[:2]
    if failed_orbits:
        for i, orbit in enumerate(failed_orbits):
            print(f"--- Orbit {i+1} ---")
            print(f"ID: {orbit.id}")
            print(f"Updated (UTC): {orbit.updated_at}")
            print(f"Status: {orbit.status}")
            details = json.dumps(orbit.artifacts, indent=2)
            # Print specifically the error part clearly
            print(f"Artifacts: {details[:500]} ...") # Truncate to avoid huge dump but see beginning
    else:
        print("No failed orbits found.")
except Exception as e:
    print(f"Error querying database: {e}")
