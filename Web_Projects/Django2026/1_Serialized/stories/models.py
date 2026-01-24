from django.db import models
from django.utils import timezone
from django.urls import reverse

# Custom Manager to handle "Future Publishing"
class PublishedManager(models.Manager):
    def published(self):
        return self.get_queryset().filter(publish_date__lte=timezone.now())

class Story(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, help_text="URL friendly version of the title")
    summary = models.TextField()
    cover_image = models.URLField(blank=True, null=True, help_text="URL to a cover image (optional)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Stories"

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('stories:story_detail', args=[self.slug])

class Chapter(models.Model):
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=200)
    number = models.IntegerField(help_text="Chapter number (1, 2, 3...)")
    content = models.TextField()
    publish_date = models.DateTimeField(default=timezone.now, help_text="When should this be visible?")
    
    # Connect the custom manager
    objects = PublishedManager() 
    # We also keep the default manager if we need to see everything in Admin
    all_objects = models.Manager()

    class Meta:
        ordering = ['number']
        unique_together = ['story', 'number']

    def __str__(self):
        return f"{self.story.title} - Ch {self.number}: {self.title}"

    def get_absolute_url(self):
        return reverse('stories:chapter_detail', args=[self.story.slug, self.number])
