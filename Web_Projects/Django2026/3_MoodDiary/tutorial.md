# Project 3: MoodDiary (The Logic)

## Goal
A journal that automatically detects if your entry is Positive or Negative using the `TextBlob` library. You will learn to override default Django behaviors.

## Step 1: Install & Setup
Ensure `textblob` is installed (`pip install textblob`) and `python -m textblob.download_corpora` is run (if needed).
Create app `journal`.

## Step 2: The Model with "Brains"
We override the `save` method. This method runs every time you call `.save()` or use the Admin.

```python
from django.db import models
from textblob import TextBlob

class Entry(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    sentiment_score = models.FloatField(blank=True, null=True) # -1.0 to 1.0
    mood_label = models.CharField(max_length=20, blank=True)

    def save(self, *args, **kwargs):
        # 1. Analyze the content
        blob = TextBlob(self.content)
        self.sentiment_score = blob.sentiment.polarity
        
        # 2. Assign label based on score
        if self.sentiment_score > 0.1:
            self.mood_label = "Positive"
        elif self.sentiment_score < -0.1:
            self.mood_label = "Negative"
        else:
            self.mood_label = "Neutral"

        # 3. Actually save to DB
        super().save(*args, **kwargs)
```

## Step 3: The View
Standard `CreateView` or FBV. You don't need to ask the user for the mood. Just ask for `content`. The model handles the rest.

## Step 4: The Template
Use the logic to style the entry.
```html
<div class="card {% if entry.mood_label == 'Negative' %}bg-red-100{% else %}bg-green-100{% endif %}">
    <p>{{ entry.content }}</p>
    <small>Mood: {{ entry.mood_label }}</small>
</div>
```

## Challenge
Add a "Weekly Mood Report" to your previous Dashboard project using this data!
