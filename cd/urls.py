from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.card_design, name='card_design'),
    url(r'^save/$', views.save, name='save'),
    url(r'^imageUpload/$', views.imageUpload, name='image_upload'),
]