from django.shortcuts import render
from apps.orbits.models import Orbit

def dashboard_view(request):
    # For demo, if not logged in, show empty or redirect. 
    # Assuming user might be anonymous for now if we skipped auth enforcement, 
    # but let's try to get user's orbits if authenticated.
    if request.user.is_authenticated:
        orbits = Orbit.objects.filter(user=request.user).order_by('-created_at')[:5]
        completed_count = Orbit.objects.filter(user=request.user, status='completed').count()
        processing_count = Orbit.objects.filter(user=request.user, status='processing').count()
    else:
        orbits = []
        completed_count = 0
        processing_count = 0
        
    context = {
        'orbits': orbits,
        'completed_count': completed_count,
        'processing_count': processing_count
    }
    return render(request, 'dashboard.html', context)
