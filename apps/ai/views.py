# apps/ai/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from asgiref.sync import async_to_sync
from apps.ai.groq_client import generate_full_project, analyze_prompt, chat_with_agent, generate_project_tree


@api_view(['POST'])
def generate_project_view(request):
    prompt = request.data.get('prompt', '').strip()
    if not prompt:
        return Response({"error": "Prompt is required"}, status=400)

    try:
        result = async_to_sync(generate_full_project)(prompt)
        return Response(result)
    except Exception as e:
        return Response({
            "error": "Generation failed (rate limit or safety filter)",
            "tip": "Wait 30 seconds or simplify your prompt",
            "details": str(e)
        }, status=503)

# Analyze prompt for live preview (used on prompt page)
@api_view(['POST'])
def analyze_prompt_view(request):
    prompt = request.data.get('prompt', '').strip()
    if not prompt:
        return Response({'error': 'Prompt is required'}, status=400)

    try:
        result = async_to_sync(analyze_prompt)(prompt)
        return Response(result)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# Lightweight chat endpoint (used by builders)
@api_view(['POST'])
def chat_view(request):
    message = request.data.get('message', '').strip()
    context = request.data.get('context', '').strip()
    if not message:
        return Response({'error': 'Message is required'}, status=400)
    try:
        reply = async_to_sync(chat_with_agent)(message, context)
        return Response({'reply': reply})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# Generate project tree for a prompt
@api_view(['POST'])
def project_tree_view(request):
    prompt = request.data.get('prompt', '').strip()
    if not prompt:
        return Response({'error': 'Prompt is required'}, status=400)

    try:
        result = async_to_sync(generate_project_tree)(prompt)
        # Normalize structure
        project_name = result.get('project_name') or 'project'
        tree = result.get('tree') or []
        return Response({'project_name': project_name, 'tree': tree})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# Optional: simple health check
@api_view(['GET'])
def health_view(request):
    return Response({"status": "AI backend is running"})