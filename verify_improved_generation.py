import os
import django
import asyncio
import json
from dotenv import load_dotenv

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'orbitverse.settings')
django.setup()

from apps.ai.groq_client import generate_full_project

async def verify_generation():
    print("Verifying Improved Generation...")
    prompt = "A comprehensive Task Management Dashboard with React and Django"
    
    try:
        print(f"Generating for prompt: '{prompt}'...")
        result = await generate_full_project(prompt)
        
        files = result.get('files', [])
        print(f"\nGenerated {len(files)} files.")
        
        for f in files:
            path = f.get('path')
            content = f.get('content', '')
            print(f"\n--- {path} ({len(content)} bytes) ---")
            
            # Check for bad patterns
            if "// ..." in content or "# ..." in content:
                print(f"WARNING: Potential placeholder found in {path}")
            
            # Print first few lines to verify
            print(content[:200] + "...")
            
    except Exception as e:
        print(f"Generation Failed: {e}")

if __name__ == "__main__":
    asyncio.run(verify_generation())
