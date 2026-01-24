from django.contrib import admin
from .models import Story, Chapter

class ChapterInline(admin.StackedInline):
    model = Chapter
    extra = 1

@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ChapterInline]

@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ('story', 'number', 'title', 'publish_date')
    list_filter = ('story', 'publish_date')
    search_fields = ('title', 'content')
