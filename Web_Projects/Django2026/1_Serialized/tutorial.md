# Project 1: Serialized (The Content Engine)

## Goal

Build a platform to publish short stories chapter-by-chapter. You will learn to manage related data (Stories vs. Chapters) and control _when_ content appears.

---

## ⚡ Quick Reference: Common Commands

_Run these in your terminal while in the project folder:_

### 1. Local Development & Testing

- **Start the Server**: `python3 manage.py runserver` (View at http://127.0.0.1:8000/)
- **Create Admin User**: `python3 manage.py createsuperuser`
- **Apply Database Changes**: `python3 manage.py makemigrations` then `python3 manage.py migrate`
- **Run Automated Tests**: `python3 manage.py test stories`

### 2. Managing Code Changes (Git)

Every time you finish a feature or fix:

1. **Check Status**: `git status`
2. **Stage Changes**: `git add .`
3. **Save (Commit)**: `git commit -m "Describe what you did"`
4. **Push to GitHub**: `git push origin main`

---

## 🛠 Testing Your Changes Locally

To see your changes as you work, follow this workflow:

1. **Update the Database**: If you changed any fields in `models.py`, run:
   ```bash
   python3 manage.py makemigrations
   python3 manage.py migrate
   ```
2. **Start the Server**:
   ```bash
   python3 manage.py runserver
   ```
3. **View the Site**: Open your browser to `http://127.0.0.1:8000/`.
4. **Manage Content**: Go to `http://127.0.0.1:8000/admin/` to add or edit stories and chapters. (Use the account you created with `createsuperuser`).
5. **Verify Logic**: Run `python3 manage.py test stories` to ensure your navigation links and publishing logic are still working correctly.

---

## Step 1: Setup

1.  **Environment**: Ensure Django is installed.
2.  **App**: Create an app called `stories`.
3.  **Config**: Add `stories` to `INSTALLED_APPS` and configure `ROOT_URLCONF`.
4.  **Secrets**: Use a `.env` file for `SECRET_KEY` and email credentials.

## Step 2: The Models (`stories/models.py`)

```python
from django.db import models
from django.utils import timezone

class Story(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    summary = models.TextField()

    class Meta:
        verbose_name_plural = "Stories"

    def __str__(self):
        return self.title

class Chapter(models.Model):
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=200)
    number = models.IntegerField()
    content = models.TextField()
    publish_date = models.DateTimeField(default=timezone.now)

    objects = PublishedManager() # Custom Manager

    class Meta:
        ordering = ['number']
        unique_together = ['story', 'number']

    def __str__(self):
        return f"{self.story.title} - Ch {self.number}"
```

## Step 3: The "Manager"

Hide future chapters from readers.

```python
class PublishedManager(models.Manager):
    def published(self):
        return self.get_queryset().filter(publish_date__lte=timezone.now())
```

## Step 4: Styling (Modern Hacker Aesthetic)

- **Primary**: Black & White.
- **Highlight**: Bright Yellow (`#ffe600`).
- **Feature**: A blinking cursor logo and E-reader reading mode.

## Step 5: Navigation Challenge (Solution)

In the `chapter_detail` view, find the next chapter by filtering the published chapters of the same story:

```python
next_chapter = Chapter.objects.published().filter(
    story=story,
    number=chapter.number + 1
).first()
```

---

## 🌐 The Live Project (GitHub & PythonAnywhere)

**Repository Link:** [https://github.com/UlrikeDetective/Serialized](https://github.com/UlrikeDetective/Serialized)

### Deployment to PythonAnywhere (Summary)

1.  **Clone** your repo into the PythonAnywhere Bash Console:
    `git clone https://github.com/UlrikeDetective/Serialized.git`
2.  **Virtualenv**: Create one and install requirements:
    `mkvirtualenv --python=/usr/bin/python3.10 serialized-venv`
    `pip install -r requirements.txt`
3.  **Static Files**: Run `python manage.py collectstatic` on the server.
4.  **Web Tab**: Configure your source code path and WSGI file.
5.  **Secrets**: Create a `.env` file manually in the server's file manager.

### Keeping the Live Site Updated

When you make changes locally:

1. **Commit & Push** locally (see "Managing Code Changes" above).
2. **On PythonAnywhere**: Open a Bash console, navigate to the folder, and run:
   ```bash
   git pull origin main
   ```
3. **Reload**: Go to the Web Tab and click the big green **Reload** button.

---

**Project Complete.**
