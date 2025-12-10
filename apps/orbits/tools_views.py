from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

# In-memory dependency and conflict rules for demonstration/MVP
# In production, these might be in a database.

TOOLS_DB = [
    {"id": "react", "name": "React", "category": "Frontend", "tags": ["web", "ui", "frontend"]},
    {"id": "vue", "name": "Vue", "category": "Frontend", "tags": ["web", "ui", "frontend"]},
    {"id": "angular", "name": "Angular", "category": "Frontend", "tags": ["web", "ui", "frontend"]},
    {"id": "node", "name": "Node.js", "category": "Backend", "tags": ["backend", "api", "server"]},
    {"id": "django", "name": "Django", "category": "Backend", "tags": ["backend", "api", "python"]},
    {"id": "python", "name": "Python", "category": "Language", "tags": ["language", "data", "backend"]},
    {"id": "postgres", "name": "PostgreSQL", "category": "Database", "tags": ["database", "sql"]},
    {"id": "mongo", "name": "MongoDB", "category": "Database", "tags": ["database", "nosql"]},
    {"id": "docker", "name": "Docker", "category": "DevOps", "tags": ["devops", "container"]},
    {"id": "npm", "name": "NPM", "category": "Tool", "tags": ["package_manager"]},
    {"id": "tailwindcss", "name": "TailwindCSS", "category": "CSS", "tags": ["ui", "css"]},
    {"id": "postcss", "name": "PostCSS", "category": "Tool", "tags": ["ui", "css"]},
]

DEPENDENCY_RULES = [
    {"tool": "react", "requires": ["node", "npm"]},
    {"tool": "vue", "requires": ["node", "npm"]},
    {"tool": "angular", "requires": ["node", "npm"]},
    {"tool": "django", "requires": ["python"]},
    {"tool": "tailwindcss", "requires": ["postcss"]},
]

CONFLICT_RULES = [
    {"set": ["react", "vue", "angular"], "message": "Select only one frontend framework (React, Vue, or Angular)."},
    {"set": ["postgres", "mongo"], "message": "Typically select one primary database unless using polyglot persistence.", "severity": "warning"},
]

class ToolsRecommendView(APIView):
    def get(self, request):
        project_type = request.query_params.get('type', '').lower()
        keywords = request.query_params.getlist('keywords', [])
        
        recommendations = []
        
        # Simple recommendation logic
        if 'web' in project_type or 'web' in keywords:
            recommendations.extend(['react', 'node', 'postgres'])
        if 'data' in project_type or 'python' in keywords:
            recommendations.extend(['python', 'django', 'postgres'])
            
        # Add keyword matches
        for tool in TOOLS_DB:
            if any(k in tool['tags'] for k in keywords):
                recommendations.append(tool['id'])
                
        # Deduplicate
        recommended_ids = list(set(recommendations))
        
        # Format response
        response_tools = []
        for tool in TOOLS_DB:
            tool_copy = tool.copy()
            tool_copy['isRecommended'] = tool['id'] in recommended_ids
            response_tools.append(tool_copy)
            
        return Response({'tools': response_tools})

class ToolsValidateView(APIView):
    def post(self, request):
        selected_ids = request.data.get('selectedToolIds', [])
        current_selection = set(selected_ids)
        
        # 1. Apply Dependencies
        changed = True
        auto_selected = set()
        
        while changed:
            changed = False
            for rule in DEPENDENCY_RULES:
                if rule['tool'] in current_selection:
                    for req in rule['requires']:
                        if req not in current_selection:
                            current_selection.add(req)
                            auto_selected.add(req)
                            changed = True
                            
        # 2. Check Conflicts
        errors = []
        for rule in CONFLICT_RULES:
            intersection = [t for t in rule['set'] if t in current_selection]
            if len(intersection) > 1:
                errors.append(f"Conflict: {', '.join(intersection)}. {rule['message']}")
        
        return Response({
            'isValid': len(errors) == 0,
            'errors': errors,
            'autoSelected': list(auto_selected),
            'finalSelection': list(current_selection)
        })

class ToolsSaveView(APIView):
    def post(self, request):
        from .models import Orbit
        orbit_id = request.data.get('orbitId')
        selected_ids = request.data.get('selectedToolIds', [])
        
        try:
            orbit = Orbit.objects.get(id=orbit_id)
            orbit.tools = selected_ids
            orbit.save()
            return Response({'success': True, 'tools': selected_ids})
        except Orbit.DoesNotExist:
            return Response({'error': 'Orbit not found'}, status=404)
