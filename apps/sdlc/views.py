from rest_framework import viewsets
from .models import SDLCNote
from .serializers import SDLCNoteSerializer

class SDLCNoteViewSet(viewsets.ModelViewSet):
    queryset = SDLCNote.objects.all()
    serializer_class = SDLCNoteSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(user=self.request.user)
        return self.queryset.none()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
