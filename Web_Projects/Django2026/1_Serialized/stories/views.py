from django.shortcuts import render, get_object_or_404
from .models import Story, Chapter

def story_list(request):
    """Shows a list of all stories."""
    stories = Story.objects.all()
    return render(request, 'stories/story_list.html', {'stories': stories})

def story_detail(request, story_slug):
    """Shows a single story and its list of PUBLISHED chapters."""
    story = get_object_or_404(Story, slug=story_slug)
    # Use our custom manager method .published()
    chapters = story.chapters.published()
    
    return render(request, 'stories/story_detail.html', {
        'story': story,
        'chapters': chapters
    })

def chapter_detail(request, story_slug, chapter_number):
    """Shows the content of a single chapter."""
    story = get_object_or_404(Story, slug=story_slug)
    chapter = get_object_or_404(Chapter, story=story, number=chapter_number)
    
    # Optional: Logic to prevent 'peeking' at future chapters via URL guessing
    # if chapter.publish_date > timezone.now() and not request.user.is_staff:
    #     raise Http404("Chapter not released yet")

    # Find the next chapter
    next_chapter = Chapter.objects.published().filter(
        story=story, 
        number=chapter.number + 1
    ).first()

    return render(request, 'stories/chapter_detail.html', {
        'story': story,
        'chapter': chapter,
        'next_chapter': next_chapter,
    })
