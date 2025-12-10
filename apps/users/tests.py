from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserTests(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(
            username='testuser', 
            email='test@example.com', 
            password='password123'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('password123'))
        self.assertEqual(user.role, 'viewer') # Default role

    def test_create_superuser(self):
        admin_user = User.objects.create_superuser(
            username='admin', 
            email='admin@example.com', 
            password='adminpass'
        )
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_staff)
