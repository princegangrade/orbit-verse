from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from .models import User

def register_view(request):
    """
    Basic registration backed by the database with duplicate checks.
    Ensures username and email are both unique before creating the user.
    """
    context = {}
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')

        if not username or not email or not password:
            context['error'] = 'All fields are required.'
            return render(request, 'register.html', context)

        if User.objects.filter(username=username).exists():
            context['error'] = 'Username is already taken.'
            return render(request, 'register.html', context)

        if User.objects.filter(email=email).exists():
            context['error'] = 'An account with this email already exists.'
            return render(request, 'register.html', context)

        user = User.objects.create_user(username=username, email=email, password=password)
        # Force user to login after registration
        return redirect('login')

    return render(request, 'register.html', context)

def login_view(request):
    """
    Login against the database using Django's auth backend.
    Returns form errors to the template instead of silently failing.
    """
    form = AuthenticationForm(request, data=request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')

from rest_framework import viewsets, permissions
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see themselves unless admin
        if self.request.user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    from rest_framework.decorators import action
    from rest_framework.response import Response

    @action(detail=False, methods=['get'], url_path='ai/suggest-role')
    def suggest_role(self, request):
        """AI analysis of user behavior to suggest role."""
        # Placeholder for AI logic
        return Response({'suggested_role': 'editor', 'reason': 'User creates many pipelines.'})
