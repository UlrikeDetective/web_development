# Project 5: StoryAPI (The Connector)

## Goal
Make your stories available to the world (or a mobile app) via JSON. You will learn the **Django Rest Framework (DRF)**.

## Step 1: Setup
1.  Install `djangorestframework`.
2.  Add `rest_framework` to `INSTALLED_APPS`.

## Step 2: Serializers (`serializers.py`)
Django models are Python objects. JavaScript needs JSON text. A Serializer converts between them.

```python
from rest_framework import serializers
from .models import Story, Chapter

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'number', 'content', 'publish_date']

class StorySerializer(serializers.ModelSerializer):
    # Nesting: Include chapters inside the story data
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = Story
        fields = ['id', 'title', 'slug', 'summary', 'chapters']
```

## Step 3: ViewSets (`views.py`)
DRF provides "ViewSets" that handle List, Create, Retrieve, Update, and Delete automatically.

```python
from rest_framework import viewsets
from .models import Story
from .serializers import StorySerializer

class StoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
```

## Step 4: Routing
Register the ViewSet in `urls.py`.
```python
from rest_framework.routers import DefaultRouter
from .views import StoryViewSet

router = DefaultRouter()
router.register(r'stories', StoryViewSet)

urlpatterns = [
    # ... other paths ...
    path('api/', include(router.urls)),
]
```
Visit `/api/stories/` in your browser to see the browsable API!

## Challenge
Secure your API so only logged-in users can read the full content of a chapter.
