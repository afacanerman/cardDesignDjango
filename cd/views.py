import json
import os
from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

def card_design(request):
    return render(request, 'cd/card_design.html', {})

def save(request):
    if request.method == 'POST':
        response_data = {}

        response_data['result'] = 'Create post successful!'

        return JsonResponse(
            response_data
        )
    else:
        return JsonResponse(
            {"nothing to see": "this isn't happening"}
        )   

def imageUpload(request):
    if request.method == 'POST':
        f = request.FILES['img']
        path = default_storage.save('cd/static/images/uploaded/' + f.name, ContentFile(f.read()))
        tmp_file = os.path.join('/static/images/uploaded/', f.name)
        return JsonResponse({'uploadedFile' : tmp_file})
    else:
        return JsonResponse({"nothing to see": "this isn't happening"}) 