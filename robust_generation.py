
import os
import django
import time
import json
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'orbitverse.settings')
django.setup()

from apps.orbits.models import Orbit
from apps.users.models import User
from apps.orbits.tasks import generate_project_task

def run_generation_loop():
    # Ensure user exists
    user = User.objects.first()
    if not user:
        user = User.objects.create_user(username='admin', email='admin@example.com', password='adminpassword')

    prompt_text = "A simple todo list app"
    max_retries = 2
    
    for attempt in range(max_retries):
        print(f"\n--- Attempt {attempt + 1}/{max_retries} ---")
        
        # Create new orbit for each attempt to avoid state confusion
        orbit = Orbit.objects.create(user=user, prompt=prompt_text)
        print(f"Created Orbit ID: {orbit.id}")
        
        try:
            # Trigger generation
            # Note: tasks.py usually updates the orbit status.
            generate_project_task.delay(orbit.id, prompt_text)
            
            # Poll for completion
            # CELERY_TASK_ALWAYS_EAGER is True, so it might return immediately, 
            # but we refresh to be sure of the DB state.
            orbit.refresh_from_db()
            
            if orbit.status == 'completed':
                print("SUCCESS: Generation completed!")
                print(f"Archetype: {orbit.archetype}")
                print(f"Tools: {orbit.tools}")
                print(f"Artifact keys: {list(orbit.artifacts.keys())}")
                return True
            
            elif orbit.status == 'failed':
                error_msg = str(orbit.artifacts.get('error', 'Unknown error'))
                print(f"FAILED: {error_msg}")
                
                if "rate limit" in error_msg.lower() or "429" in error_msg:
                    print("Rate limit detected. Waiting 70 seconds...")
                    time.sleep(70)
                    continue # Retry loop
                else:
                    print("Non-retriable error. Stopping.")
                    return False
            
            else:
                # If still processing (unlikely with Eager=True but possible if async)
                print(f"Status is '{orbit.status}'. Waiting...")
                time.sleep(5)
                orbit.refresh_from_db()
                if orbit.status == 'completed':
                     print("SUCCESS!")
                     return True
                
        except Exception as e:
            print(f"Exception during execution: {e}")
            
    print("Max retries reached. Generation failed.")
    return False

if __name__ == "__main__":
    run_generation_loop()
