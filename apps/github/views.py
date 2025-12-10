from django.shortcuts import redirect
from django.conf import settings
import requests

def github_login(request):
    client_id = settings.GITHUB_CLIENT_ID
    return redirect(f"https://github.com/login/oauth/authorize?client_id={client_id}&scope=repo")

def github_callback(request):
    code = request.GET.get('code')
    # Exchange code for token (Mock implementation for now)
    # In real app: POST to https://github.com/login/oauth/access_token
    # Store token in session or user profile
    return redirect('home')

def push_to_github(request, orbit_id):
    # Logic to push files
    return redirect('orbit_results', orbit_id=orbit_id)
