from django.shortcuts import render
from django.http import HttpResponse

def say_hello(request):
    return render(request, "index.html", {'page': 'home'})


def search(request):
    return render(request, "search.html", {'page': 'search'})