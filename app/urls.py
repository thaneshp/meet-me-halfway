from django.urls import path
from app import views

# URLConf
urlpatterns = [
    path('hello/', views.say_hello, name="index"),
    path('search/', views.search, name="search")
]