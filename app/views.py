from django.shortcuts import render
from django.http import HttpResponse
import os


def say_hello(request):
    return render(request, "index.html", {"page": "home"})


def search(request):
    context = {
        "google_maps_api_key": os.getenv("GOOGLE_MAPS_API_KEY"),
        "page": "search",
    }
    return render(request, "search.html", context)
