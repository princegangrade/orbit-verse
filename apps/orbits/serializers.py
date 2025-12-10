from rest_framework import serializers
from .models import Orbit

class OrbitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orbit
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at', 'updated_at', 'status', 'artifacts', 'version')
