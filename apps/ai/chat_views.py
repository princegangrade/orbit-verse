from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.ai.groq_client import chat_with_agent
from asgiref.sync import async_to_sync

@api_view(['POST'])
def chat_api(request):
    message = request.data.get('message')
    context = request.data.get('context', '')
    
    try:
        response = async_to_sync(chat_with_agent)(message, context)
        return Response({'response': response})
    except Exception as e:
        return Response({'response': f"Error: {str(e)}"}, status=500)
