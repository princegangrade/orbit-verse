from rest_framework import serializers
from .models import SDLCNote

class SDLCNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDLCNote
        fields = ['id', 'phase', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
