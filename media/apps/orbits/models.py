import uuid
from django.db import models

class Orbit(models.Model):
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='orbits')
    prompt = models.TextField()  # User's original project description
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    archetype = models.CharField(max_length=100, blank=True)  # e.g., 'E-commerce', 'Dashboard'
    tools = models.JSONField(default=list)  # List of technologies
    artifacts = models.JSONField(default=dict)  # Generated files and metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
