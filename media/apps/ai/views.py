from rest_framework.decorators import api_view
from rest_framework.response import Response
from asgiref.sync import async_to_sync
from .gemini_client import analyze_prompt, chat_with_agent # chat_with_agent mentioned in prompt but not implemented yet

@api_view(['POST'])
def analyze_prompt_view(request):
    prompt = request.data.get('prompt')
    if not prompt:
        return Response({'error': 'Prompt is required'}, status=400)
    
    try:
        result = async_to_sync(analyze_prompt)(prompt)
        return Response(result)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def chat_view(request):
    # Placeholder for chat view
    return Response({'message': 'Chat not implemented yet'})
