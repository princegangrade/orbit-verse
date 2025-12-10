import uuid
from django.db import models

class SDLCNote(models.Model):
    PHASE_CHOICES = [
        ('Requirement', 'Requirement'),
        ('Analysis', 'Analysis'),
        ('Design', 'Design'),
        ('Implementation', 'Implementation'),
        ('Testing', 'Testing'),
        ('Deployment', 'Deployment'),
        ('Maintenance', 'Maintenance'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='sdlc_notes')
    phase = models.CharField(max_length=50, choices=PHASE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
