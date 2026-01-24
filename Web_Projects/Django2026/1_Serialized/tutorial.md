# Project 1: Serialized (The Content Engine)

## Goal

Build a platform to publish short stories chapter-by-chapter. You will learn to manage related data (Stories vs. Chapters) and control _when_ content appears.

## Step 1: Setup

1.  Start a new project (or use your main one) and create an app called `stories`.
2.  Add `stories` to `INSTALLED_APPS` in `settings.py`.

## Step 2: The Models (`stories/models.py`)

We need two models. A `Chapter` belongs to a `Story`.

```python
from django.db import models
from django.utils import timezone

class Story(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True) # For URLs like /story/the-hobbit/
    summary = models.TextField()

    def __str__(self):
        return self.title

class Chapter(models.Model):
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=200)
    number = models.IntegerField() # To order them: Chapter 1, 2, 3...
    content = models.TextField()
    publish_date = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['number'] # Default ordering

    def __str__(self):
        return f"{self.story.title} - Ch {self.number}: {self.title}"
```

## Step 3: The "Manager" (Advanced)

We don't want users to see chapters scheduled for next week.
Add this `Manager` to your `models.py` (above the Chapter class) and attach it to `Chapter`.

```python
class PublishedManager(models.Manager):
    def published(self):
        return self.get_queryset().filter(publish_date__lte=timezone.now())

# Update Chapter model:
class Chapter(models.Model):
    # ... fields ...
    objects = PublishedManager() # Replaces the default objects
```

_Usage:_ `Chapter.objects.published()` will now only return released chapters.

## Step 4: URL Routing (`stories/urls.py`)

Use the slugs!

```python
path('<slug:story_slug>/', views.story_detail, name='story_detail'),
path('<slug:story_slug>/<int:chapter_number>/', views.chapter_detail, name='chapter_detail'),
```

## Step 5: The Views

1.  `story_detail`: Fetch the `Story`. Pass `story.chapters.published()` to the template so users only see available links.
2.  `chapter_detail`: Fetch the specific chapter using both `story_slug` and `chapter_number`.

## Challenge

Create a "Next Chapter" link in your template.
_Hint:_ In your view or model, try to find the chapter with `number = current_number + 1`.

## Admin

Create a superuser to start adding stories via the admin panel:

```python
   python3 manage.py createsuperuser
```

And start the development server:

```python
python3 manage.py runserver
```
