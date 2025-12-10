from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Orbit

User = get_user_model()

class OrbitTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='orbituser', 
            email='orbit@example.com', 
            password='password123'
        )

    def test_create_orbit(self):
        orbit = Orbit.objects.create(
            user=self.user,
            prompt="Create a test application",
            archetype="Web App"
        )
        self.assertEqual(orbit.user, self.user)
        self.assertEqual(orbit.status, 'processing') # Default status
        self.assertEqual(orbit.prompt, "Create a test application")
        self.assertEqual(orbit.archetype, "Web App")
