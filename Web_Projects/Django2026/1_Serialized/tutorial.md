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

### Step 1: Push your code to GitHub

You need to get your code into a GitHub repository. Open your terminal and run:

1.  Stage all changes:

1 git add .
2 git commit -m "Prepare for deployment: Added requirements, WhiteNoise, and production settings" 2. Create a new repo on GitHub.com (name it Serialized). 3. Link and Push:

1 git remote add origin https://github.com/YOUR_USERNAME/Serialized.git
2 git branch -M main
3 git push -u origin main

---

### Step 2: Set up PythonAnywhere

Now, log in to your PythonAnywhere account and follow these steps:

A. Clone the Repository
Open a Bash Console on PythonAnywhere and run:
1 git clone https://github.com/YOUR_USERNAME/Serialized.git
2 cd Serialized

B. Create a Virtual Environment

1 mkvirtualenv --python=/usr/bin/python3.10 serialized-venv
2 pip install -r requirements.txt

C. Setup the Database & Static Files
1 python manage.py migrate
2 python manage.py collectstatic

D. Configure the Web Tab

1.  Go to the Web Tab in the PythonAnywhere dashboard.
2.  Click Add a new web app.
3.  Choose Manual Configuration (do NOT choose the Django option).
4.  Choose your Python version (e.g., 3.10).
5.  Virtualenv: Enter the path to your venv: /home/YOUR_USERNAME/.virtualenvs/serialized-venv.
6.  Code Section: Set "Source code" to /home/YOUR_USERNAME/Serialized.
7.  WSGI Configuration: Click the link to the WSGI configuration file and replace everything with this:


    1 import os
    2 import sys
    3
    4 path = '/home/YOUR_USERNAME/Serialized'
    5 if path not in sys.path:
    6     sys.path.append(path)
    7
    8 os.environ['DJANGO_SETTINGS_MODULE'] = 'stories.settings'
    9

10 from django.core.wsgi import get_wsgi_application
11 application = get_wsgi_application()

---

### Step 3: Add your .env file to PythonAnywhere

Since .env is ignored by git, you must create it manually on the server:

1.  In the PythonAnywhere Files Tab, go to /home/YOUR_USERNAME/Serialized.
2.  Create a new file named .env.
3.  Paste your secrets into it (the same ones you have locally).

Finally, go back to the Web Tab and click Reload. Your site should be live at YOUR_USERNAME.pythonanywhere.com!
