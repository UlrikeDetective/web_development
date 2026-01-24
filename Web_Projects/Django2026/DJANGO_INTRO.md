# Django Core Principles & Quick Reference

## 1. The Request-Response Cycle
Everything in Django happens in this order:
1.  **URL (The Map):** User visits a link -> Django looks at `urls.py` to find a match.
2.  **View (The Logic):** The URL points to a function (or class) in `views.py`. This function fetches data and decides what to show.
3.  **Model (The Data):** The View asks the `models.py` (Database) for specific data (e.g., "Give me all published stories").
4.  **Template (The Presentation):** The View hands that data to an HTML file in `templates/` to render it for the user.

## 2. Key Components

### Models (`models.py`)
*   **What:** Defines your database structure.
*   **Analogy:** The blueprint for your data tables.
*   **Key:** Changing this requires running `python manage.py makemigrations` and `python manage.py migrate`.

### Views (`views.py`)
*   **What:** The logic center. Python functions that take a web request and return a web response.
*   **Analogy:** The traffic controller or the chef gathering ingredients.

### Templates (`templates/*.html`)
*   **What:** HTML files mixed with Django Template Language (DTL).
*   **Syntax:**
    *   `{{ variable }}` for printing data.
    *   `{% tag %}` for logic (loops, ifs).
    *   `{% url 'name' %}` for generating links (never hardcode URLs!).

### URLs (`urls.py`)
*   **What:** Connects browser addresses to View functions.
*   **Tip:** Always name your URLs (e.g., `path('post/<int:pk>/', views.post_detail, name='post_detail')`).

## 3. The "Admin"
*   **What:** A built-in, ready-to-use interface to manage your data.
*   **Action:** Create a superuser (`python manage.py createsuperuser`) to access it at `/admin/`.

## 4. Useful Commands
*   `python manage.py runserver` - Starts the web server.
*   `python manage.py startapp <name>` - Creates a new component/app.
*   `python manage.py makemigrations` - Prepares database changes.
*   `python manage.py migrate` - Applies database changes.
*   `python manage.py shell` - Interactive console to test code.
