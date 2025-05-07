import json
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from .models import Image, Post

@require_POST
@login_required
def upload_image(request):
    f = request.FILES.get('file')
    if not f:
        return JsonResponse({'error': 'No file'}, status=400)
    img = Image.objects.create(uploader=request.user, file=f)
    return JsonResponse({'id': img.id, 'url': img.file.url})

@require_POST
@login_required
def post_text(request):
    data = json.loads(request.body)
    body = data.get('body', '').strip()
    if not body:
        return JsonResponse({'error': 'Empty text'}, status=400)
    post = Post.objects.create(author=request.user, body=body, status='published')
    return JsonResponse({'id': post.id, 'slug': post.slug})