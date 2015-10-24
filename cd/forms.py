from django import forms

class FileUploadForm(forms.Form):
    image = forms.ImageField(label='Select a file', help_text='max. 20 megabytes')