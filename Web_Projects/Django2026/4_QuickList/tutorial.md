# Project 4: QuickList (The Interaction)

## Goal
A To-Do list that feels like an app. Clicking "Done" shouldn't reload the whole page. You will learn **HTMX**.

## Step 1: Setup
1.  Install `django-htmx`.
2.  Add it to `INSTALLED_APPS` and middleware (check their docs).
3.  Add the script to your base template:
    `<script src="https://unpkg.com/htmx.org@1.9.6"></script>`

## Step 2: The View (Partials)
We need a view that handles the "toggle" action and returns *only* the updated list item, not the whole page.

```python
# views.py
from django.shortcuts import render, get_object_or_404
from .models import TodoItem

def toggle_item(request, pk):
    item = get_object_or_404(TodoItem, pk=pk)
    item.is_done = not item.is_done
    item.save()
    
    # Return ONLY the partial template for this single item
    return render(request, 'partials/todo_item.html', {'item': item})
```

## Step 3: The Template (The Component)
Create `templates/partials/todo_item.html`. This is just the `<li>` tag.

```html
<!-- partials/todo_item.html -->
<li id="item-{{ item.id }}" class="{% if item.is_done %}strike-through{% endif %}">
    {{ item.title }}
    <button 
        hx-post="{% url 'toggle_item' item.id %}" 
        hx-target="#item-{{ item.id }}" 
        hx-swap="outerHTML">
        {% if item.is_done %}Undo{% else %}Done{% endif %}
    </button>
</li>
```
*   `hx-post`: Send a POST request to this URL when clicked.
*   `hx-target`: Replace the element with this ID...
*   `hx-swap`: ...with the HTML returned by the server.

## Challenge
Add a delete button that fades the item out before removing it (HTMX supports CSS transitions!).
