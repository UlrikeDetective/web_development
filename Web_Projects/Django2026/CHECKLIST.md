# Django Learning Progress Checklist

## 1. Serialized (The Content Engine)
**Focus:** Models, ForeignKeys, Custom Managers, Ordering.
- [ ] Project Created (`django-admin startproject config .`)
- [ ] App `stories` created & registered.
- [ ] `Story` and `Chapter` models defined with `ForeignKey`.
- [ ] URL slugs implemented for clean paths (`/story/my-title/`).
- [ ] "Future Publishing" logic added (Custom Manager).
- [ ] Views & Templates created to display chapters.

## 2. LifeMetrics (The Dashboard)
**Focus:** Aggregation, Chart.js, Data Passing.
- [ ] App `dashboard` created.
- [ ] `Metric` model created (date, value, category).
- [ ] `views.py` calculates totals using `.aggregate()` and `.annotate()`.
- [ ] Template includes `Chart.js` via CDN.
- [ ] Data passed from View to JavaScript correctly (using `json_script`).

## 3. MoodDiary (The Logic)
**Focus:** Signals/Overrides, External Libraries (`textblob`).
- [ ] App `journal` created.
- [ ] `Entry` model created (content, date, mood_field).
- [ ] `save()` method overridden to analyze content with TextBlob before saving.
- [ ] Admin interface shows the auto-detected mood.
- [ ] Conditional formatting in template (Red for negative, Green for positive).

## 4. QuickList (The Interaction)
**Focus:** HTMX, Partial Rendering, UX.
- [ ] App `lists` created.
- [ ] `TodoItem` model created (title, is_done).
- [ ] `django-htmx` installed and configured.
- [ ] View created that returns *only* a partial HTML fragment (not a full page).
- [ ] "Check" button updates database and removes item from screen without refresh.

## 5. StoryAPI (The Connector)
**Focus:** REST Framework, Serialization, JSON.
- [ ] `djangorestframework` installed and added to `INSTALLED_APPS`.
- [ ] `serializers.py` created for Story and Chapter models.
- [ ] API Views (ViewSets) created.
- [ ] `urls.py` router configured.
- [ ] Verified JSON output at `/api/stories/`.
