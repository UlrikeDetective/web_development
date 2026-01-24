from django.test import TestCase, Client
from django.utils import timezone
from django.urls import reverse
from .models import Story, Chapter
import datetime

class ChapterNavigationTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.story = Story.objects.create(
            title="The Hobbit", 
            slug="the-hobbit", 
            summary="A journey."
        )
        self.ch1 = Chapter.objects.create(
            story=self.story,
            title="An Unexpected Party",
            number=1,
            content="In a hole in the ground...",
            publish_date=timezone.now() - datetime.timedelta(days=1)
        )
        self.ch2 = Chapter.objects.create(
            story=self.story,
            title="Roast Mutton",
            number=2,
            content="Trolls!",
            publish_date=timezone.now() - datetime.timedelta(days=1)
        )

    def test_next_chapter_link_exists(self):
        """Chapter 1 should link to Chapter 2."""
        url = reverse('stories:chapter_detail', args=[self.story.slug, self.ch1.number])
        response = self.client.get(url)
        self.assertContains(response, 'Next Chapter')
        self.assertContains(response, reverse('stories:chapter_detail', args=[self.story.slug, self.ch2.number]))

    def test_no_next_chapter_link_on_last_chapter(self):
        """Chapter 2 should NOT have a next link (it's the last one)."""
        url = reverse('stories:chapter_detail', args=[self.story.slug, self.ch2.number])
        response = self.client.get(url)
        self.assertNotContains(response, 'Next Chapter')
        self.assertContains(response, 'To be continued')

    def test_next_chapter_hidden_if_unpublished(self):
        """Chapter 1 should NOT link to Chapter 2 if Chapter 2 is unpublished."""
        # Unpublish chapter 2
        self.ch2.publish_date = timezone.now() + datetime.timedelta(days=1)
        self.ch2.save()
        
        url = reverse('stories:chapter_detail', args=[self.story.slug, self.ch1.number])
        response = self.client.get(url)
        self.assertNotContains(response, 'Next Chapter')

class StoryViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.story = Story.objects.create(
            title="The Hobbit", 
            slug="the-hobbit", 
            summary="A journey."
        )

    def test_story_list_view(self):
        url = reverse('stories:story_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'stories/story_list.html')
        self.assertContains(response, "The Hobbit")

    def test_story_detail_view(self):
        url = reverse('stories:story_detail', args=[self.story.slug])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'stories/story_detail.html')
        self.assertContains(response, "The Hobbit")
        self.assertContains(response, "A journey.")
