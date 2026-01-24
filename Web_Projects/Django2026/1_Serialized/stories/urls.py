from django.contrib import admin
from django.urls import path, include
from . import views

# Define the app's specific patterns
story_urlpatterns = [
    path('', views.story_list, name='story_list'),
    path('<slug:story_slug>/', views.story_detail, name='story_detail'),
    path('<slug:story_slug>/<int:chapter_number>/', views.chapter_detail, name='chapter_detail'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include the story patterns under the 'stories' namespace
    path('', include((story_urlpatterns, 'stories'), namespace='stories')),
]