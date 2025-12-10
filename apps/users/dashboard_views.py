from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from apps.orbits.models import Orbit

@login_required(login_url='login')
def dashboard_view(request):
    # Recent orbits for the list (only the logged-in user)
    orbits = Orbit.objects.filter(user=request.user).order_by('-created_at')[:5]

    # Stats
    total_launches = Orbit.objects.filter(user=request.user).count()
    completed_count = Orbit.objects.filter(user=request.user, status='completed').count()
    failed_count = Orbit.objects.filter(user=request.user, status='failed').count() # Optional

    if total_launches > 0:
        success_rate = int((completed_count / total_launches) * 100)
    else:
        success_rate = 0

    processing_count = Orbit.objects.filter(user=request.user, status='processing').count()

    context = {
        'orbits': orbits,
        'total_launches': total_launches,
        'success_rate': success_rate,
        'processing_count': processing_count
    }
    return render(request, 'dashboard.html', context)
