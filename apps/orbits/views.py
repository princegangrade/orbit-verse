from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.http import HttpResponse

import zipfile
import io
from asgiref.sync import async_to_sync

from .models import Orbit
from .serializers import OrbitSerializer
from .tasks import generate_project_task
from apps.ai.groq_client import generate_full_project, analyze_prompt

class OrbitViewSet(viewsets.ModelViewSet):
    queryset = Orbit.objects.all()
    serializer_class = OrbitSerializer
    
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Orbit.objects.none()
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        orbit = self.get_object()
        context = request.data.get('context', '')
        generate_project_task.delay(orbit.id, orbit.prompt, context)
        return Response({'status': 'processing', 'message': 'Generation started'}, status=status.HTTP_202_ACCEPTED)

    @action(detail=False, methods=['post'], url_path='ai/analyze')
    def analyze(self, request):
        prompt = request.data.get('prompt')
        if not prompt:
            return Response({'error': 'Prompt required'}, status=400)
        try:
            analysis = async_to_sync(analyze_prompt)(prompt)
            return Response(analysis)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

# --- Template Views ---

def prompt_view(request):
    return render(request, 'prompt.html')

def create_orbit_view(request):
    if request.method == 'POST':
        prompt_text = request.POST.get('prompt')
        
        # Auto-login Guest Logic
        if not request.user.is_authenticated:
             User = get_user_model()
             user = User.objects.first()
             if not user:
                 user = User.objects.create_user(username='guest', email='guest@example.com', password='guestpassword')
             from django.contrib.auth import login
             login(request, user)
             request.user = user
        
        orbit = Orbit.objects.create(user=request.user, prompt=prompt_text)
        try:
            generate_project_task.delay(orbit.id, prompt_text)
        except Exception as e:
            orbit.status = 'failed'
            orbit.artifacts = {'error': str(e)}
            orbit.save()
            
        return redirect('orbit_progress', orbit_id=orbit.id)
    return redirect('prompt')

def orbit_progress_view(request, orbit_id):
    try:
        orbit = Orbit.objects.get(id=orbit_id)
        return render(request, 'progress.html', {'orbit': orbit})
    except Orbit.DoesNotExist:
        return redirect('prompt')

def orbit_results_view(request, orbit_id):
    try:
        orbit = Orbit.objects.get(id=orbit_id)
        return render(request, 'results.html', {'orbit': orbit})
    except Orbit.DoesNotExist:
        return redirect('prompt')

def history_list_view(request):
    # This view powers the slide-over history panel
    if request.user.is_authenticated:
        orbits = Orbit.objects.filter(user=request.user).order_by('-created_at')
    else:
        orbits = []
    
    # Renders the partial template
    return render(request, 'partials/history_list.html', {'orbits': orbits})

# --- Semi-Auto & Utility Views ---

def semi_auto_create_view(request):
    if request.method == 'POST':
        prompt_text = request.POST.get('prompt')
        User = get_user_model()
        if not request.user.is_authenticated:
            user = User.objects.first() or User.objects.create_user(username='guest', email='guest@example.com', password='guest')
            from django.contrib.auth import login
            login(request, user)
        
        orbit = Orbit.objects.create(user=request.user, prompt=prompt_text, status='processing', artifacts={'step': 'requirements'})
        return redirect('semi_auto_builder', orbit_id=orbit.id)
    return render(request, 'semi_auto_setup.html')

def semi_auto_builder_view(request, orbit_id):
    orbit = Orbit.objects.get(id=orbit_id)
    current_step = orbit.artifacts.get('step', 'requirements')
    context = {'orbit': orbit, 'step': current_step, 'architecture': orbit.artifacts.get('architecture', {})}
    return render(request, 'semi_auto_builder.html', context)

def semi_auto_next_view(request, orbit_id):
    orbit = Orbit.objects.get(id=orbit_id)
    if request.method == 'POST':
        action = request.POST.get('action', 'next')
        step = request.POST.get('step')

        if action == 'back':
            if step == 'architecture':
                orbit.artifacts['step'] = 'requirements'
                orbit.save()
            elif step == 'implementation':
                orbit.artifacts['step'] = 'architecture'
                orbit.save()
            return redirect('semi_auto_builder', orbit_id=orbit.id)

        # Default 'next' logic
        if step == 'requirements':
            updated_prompt = request.POST.get('prompt')
            orbit.prompt = updated_prompt
            try:
                analysis = async_to_sync(analyze_prompt)(updated_prompt)
                orbit.archetype = analysis.get('archetype', 'Web App')
                orbit.tools = analysis.get('tools', [])
                orbit.artifacts['architecture'] = analysis
                orbit.artifacts['step'] = 'architecture'
                orbit.save()
            except:
                orbit.artifacts['step'] = 'architecture'
                orbit.archetype, orbit.tools = "Custom Web App", ["React", "Django"]
                orbit.save()
        elif step == 'architecture':
            orbit.archetype = request.POST.get('archetype')
            orbit.artifacts['step'] = 'implementation'
            orbit.save()
        elif step == 'implementation':
            generate_project_task.delay(orbit.id, orbit.prompt, context=f"Archetype: {orbit.archetype}")
            return redirect('orbit_progress', orbit_id=orbit.id)
    return redirect('semi_auto_builder', orbit_id=orbit.id)

def download_orbit_view(request, orbit_id):
    orbit = Orbit.objects.get(id=orbit_id)
    files = orbit.artifacts.get('files', [])
    if not files: return HttpResponse("No files.", status=404)
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in files: z.writestr(f['path'], f['content'])
    buffer.seek(0)
    resp = HttpResponse(buffer, content_type='application/zip')
    resp['Content-Disposition'] = f'attachment; filename="orbit_{orbit.id}.zip"'
    return resp

def github_push_view(request, orbit_id):
    orbit = Orbit.objects.get(id=orbit_id)
    return redirect(f'/orbits/{orbit.id}/results/?action=push_success')
