import os
import json
import re
import asyncio
import logging
from groq import Groq, AsyncGroq

logger = logging.getLogger(__name__)

# Initialize Groq client
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    logger.warning("GROQ_API_KEY not set in .env")

client = AsyncGroq(api_key=api_key)

async def generate_full_project(user_prompt: str) -> dict:
    """
    Generate a complete web app project structure using Groq.
    """
    system_prompt = f"""
    You are an expert Frontend Developer. Your task is to generate a **WORLD-CLASS, PRODUCTION-READY** web application for: "{user_prompt}" using **Vanilla HTML, CSS, and JavaScript**.
    
    CRITICAL QUALITY STANDARDS:
    1. **MODERN JAVASCRIPT**: Use ES6+ syntax (const/let, arrow functions, async/await).
    2. **RESPONSIVE DESIGN**: The UI MUST look perfect on Mobile, Tablet, and Desktop. Use TailwindCSS.
    3. **ROBUST LOGIC**: Handle edge cases. Use `console.log` extensively for debugging.
    4. **CONSISTENT IDs**: Ensure HTML `id` attributes match EXACTLY with `document.getElementById` calls in JS. Use simple, descriptive IDs (e.g., `counter-btn`, `display-area`).
    5. **BEAUTIFUL UI**: Use gradients, shadows, and rounded corners.
    
    REQUIRED FILES:
    - `index.html` (Semantic HTML5, meta viewport, font-awesome CDN).
    - `style.css` (Custom animations, glassmorphism).
    - `script.js` (Modular code. Wrap logic in `DOMContentLoaded`).
    
    OUTPUT FORMAT:
    You must output ONLY valid JSON.
    
    {{
      "project_name": "my_vanilla_app",
      "stack": "Vanilla HTML/JS",
      "explanation": "Brief summary.",
      "files": [
        {{
            "path": "index.html",
            "content": "<!DOCTYPE html>..."
        }},
        {{
            "path": "style.css",
            "content": "/* Custom styles */..."
        }},
        {{
            "path": "script.js",
            "content": "// Logic\\nconsole.log('App initialized');..."
        }}
      ]
    }}
    """
    # Override with tighter quality rules for HTML/CSS/JS accuracy
    system_prompt = f"""
    You are an expert Frontend Developer. Build a production-ready vanilla web app for: "{user_prompt}".

    QUALITY RULES (MUST FOLLOW):
    - Modern JS (ES6+). Wrap all DOM logic in DOMContentLoaded.
    - IDs: every element referenced in JS must exist in HTML with matching id.
    - Tailwind CDN + custom stylesheet (style.css). Keep Tailwind link in head.
    - Responsiveness: mobile-first layout, fluid spacing, readable typography.
    - Accessibility: aria-labels on interactive elements; proper landmarks.
    - UX polish: gradients, shadows, hover/focus states; avoid lorem ipsum.
    - Logging: console.log at init and key interactions; guard against missing data.

    REQUIRED FILES:
    - index.html: semantic HTML5, meta viewport, links Tailwind CDN and style.css, loads script.js at end of body.
    - style.css: custom theming (glassmorphism, animations, responsive tweaks).
    - script.js: DOMContentLoaded handler, query elements by id, add event listeners, safe checks, clear comments.

    JSON OUTPUT ONLY:
    {{
      "project_name": "my_vanilla_app",
      "stack": "Vanilla HTML/CSS/JS",
      "explanation": "Brief summary.",
      "files": [
        {{"path": "index.html", "content": "<!DOCTYPE html>..."}},
        {{"path": "style.css", "content": "/* styles */"}},
        {{"path": "script.js", "content": "// js"}}
      ]
    }}
    """
    
    try:
        completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=8192,
            top_p=0.8,
            stop=None,
            stream=False,
            response_format={"type": "json_object"}
        )

        content = completion.choices[0].message.content
        return json.loads(content)

    except Exception as e:
        logger.error(f"Groq generation failed: {e}")
        # Fallback to text parsing if JSON mode fails or returns invalid JSON wrapped in text
        # But with response_format={"type": "json_object"} it should be robust.
        raise e

async def analyze_prompt(prompt: str) -> dict:
    """
    Analyze user prompt and extract metadata using Groq.
    """
    system_prompt = """
    You are an expert software architect. Analyze the user's project idea and return a JSON object with:
    1. "archetype": A short, descriptive name for the app type (e.g., "E-commerce", "SaaS Dashboard").
    2. "tools": A list of 4-6 recommended tools/libraries (e.g., "React", "Tailwind", "Supabase").
    3. "checklist": A list of 3-4 key features to implement.
    
    Output ONLY valid JSON.
    Example:
    {
      "archetype": "E-commerce Store",
      "tools": ["React", "Tailwind", "Stripe", "Zustand"],
      "checklist": ["Product Listing", "Shopping Cart", "Checkout Flow"]
    }
    """
    
    try:
        completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=2048,
            top_p=0.8,
            stream=False,
            response_format={"type": "json_object"}
        )

        content = completion.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        logger.error(f"Groq analysis failed: {e}")
        raise e


async def generate_project_tree(prompt: str) -> dict:
    """
    Generate a concise project tree (dirs/files) for a given prompt.
    Returns JSON:
    {
      "project_name": "string",
      "tree": [
        {"path": "project/", "type": "dir"},
        {"path": "project/backend/", "type": "dir"},
        {"path": "project/backend/app.py", "type": "file"},
        ...
      ]
    }
    """
    system_prompt = """
    You are a senior software architect. Given a project description, output a minimal, sensible project folder tree.
    Rules:
    - Return JSON with keys: "project_name" and "tree".
    - "tree" is a flat list of objects: { "path": "...", "type": "dir|file" }.
    - Prefer 8-18 entries total. Keep concise but real-world (backend, frontend, infra, docs).
    - Do not include code content, only paths.
    - Use forward slashes.
    Example:
    {
      "project_name": "orbit-portal",
      "tree": [
        {"path": "orbit-portal/", "type": "dir"},
        {"path": "orbit-portal/backend/", "type": "dir"},
        {"path": "orbit-portal/backend/app.py", "type": "file"},
        {"path": "orbit-portal/backend/requirements.txt", "type": "file"},
        {"path": "orbit-portal/frontend/", "type": "dir"},
        {"path": "orbit-portal/frontend/src/App.tsx", "type": "file"},
        {"path": "orbit-portal/frontend/package.json", "type": "file"},
        {"path": "orbit-portal/infra/docker-compose.yml", "type": "file"},
        {"path": "orbit-portal/docs/README.md", "type": "file"}
      ]
    }
    """

    try:
        completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=1024,
            top_p=0.8,
            stream=False,
            response_format={"type": "json_object"}
        )
        content = completion.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        logger.error(f"Groq project tree generation failed: {e}")
        raise e


async def chat_with_agent(message: str, context: str = "") -> str:
    """
    Chat with the AI assistant using Groq.
    """
    try:
        messages = []
        if context:
            messages.append({"role": "system", "content": f"Context: {context}"})
        
        messages.append({"role": "user", "content": message})

        completion = await client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1024,
            top_p=1,
            stream=False
        )

        return completion.choices[0].message.content
    except Exception as e:
        logger.error(f"Groq chat failed: {e}")
        return f"Error: {str(e)}"
