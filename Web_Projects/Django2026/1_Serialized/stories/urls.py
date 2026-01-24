from django.urls import path
from . import views

app_name = 'stories'

urlpatterns = [
    path('', views.story_list, name='story_list'),
    path('<slug:story_slug>/', views.story_detail, name='story_detail'),
    path('<slug:story_slug>/<int:chapter_number>/', views.chapter_detail, name='chapter_detail'),
]
