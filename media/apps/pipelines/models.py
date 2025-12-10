import uuid
from django.db import models

class Pipeline(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='pipelines')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    blocks = models.JSONField(default=list)  # Array of block configurations
    version = models.CharField(max_length=20, default='1.0.0')
    metadata = models.JSONField(default=dict)  # author, tags, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
