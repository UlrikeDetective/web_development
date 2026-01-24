### 1. Activate your Environment:

     -  conda activate django

### 2. Initialize the Project:

     -  Run this command inside the Django folder:
        -  django-admin startproject config .
     -  (Note the `.` at the end is important! It installs the configuration in the current folder instead of making a
        new subfolder.)

### 3. Configure Settings:

     -  Open Django/config/settings.py and find INSTALLED_APPS. Add your new app:
        -  INSTALLED_APPS = [
               ...
               'stories',  # Add this line!
           ]

### 4. Connect URLs:

     -  Open Django/config/urls.py and update it to include your stories:
        -  from django.urls import path, include  # Import include
        -  urlpatterns = [
               path('admin/', admin.site.urls),
               path('stories/', include('stories.urls')), # Add this line!
           ]

### 5. Run Migrations & Server:

     -  python manage.py makemigrations
     -  python manage.py migrate
     -  python manage.py createsuperuser  # So you can log in to admin
     -  python manage.py runserver

Visit http://127.0.0.1:8000/stories/ and you should see your app running! You can go to /admin/ to add some
stories and chapters.
