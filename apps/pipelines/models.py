from django.db import models
from django.conf import settings
import uuid

class Pipeline(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pipelines')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    config = models.JSONField(default=dict)  # Stores nodes and edges
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    version = models.IntegerField(default=1)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'name']),
        ]

    def __str__(self):
        return self.name
