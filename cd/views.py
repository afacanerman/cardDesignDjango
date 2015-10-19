import json
import pdb
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

def card_design(request):
    return render(request, 'cd/card_design.html', {})

@csrf_exempt
def save(request):
    response_data = {}
    if request.method == "POST":
        print(request.POST['frontData'])
        import pdb; pdb.set_trace()
        response_data['result'] = 'ok'
        response_data['message'] = 'sucess'
    return HttpResponse(json.dumps(response_data), content_type="application/json")