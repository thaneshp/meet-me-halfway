from django.urls import path
from app import views

# URLConf
urlpatterns = [
    path("", views.search, name="search"),
    path("hello/", views.say_hello, name="index"),
]
