# Project 2: LifeMetrics (The Dashboard)

## Goal
Build a personal dashboard that visualizes data (e.g., daily writing word counts). You will learn to "aggregate" data in Python and visualize it with JavaScript.

## Step 1: The Model
Create an app `dashboard`.
```python
class Metric(models.Model):
    name = models.CharField(max_length=100) # e.g., "Words Written"
    value = models.IntegerField()
    date = models.DateField(auto_now_add=True)
```

## Step 2: Aggregation (The Magic)
In `views.py`, we don't just want a list of numbers. We want totals.
```python
from django.db.models import Sum
from .models import Metric

def dashboard_view(request):
    # Get total words written... ever
    total_count = Metric.objects.aggregate(Sum('value'))['value__sum']
    
    # Get data for the chart (last 7 entries)
    recent_data = Metric.objects.all().order_by('-date')[:7]
    
    # Prepare data for JS (Lists work best)
    labels = [m.date.strftime("%Y-%m-%d") for m in recent_data]
    data_points = [m.value for m in recent_data]

    return render(request, 'dashboard.html', {
        'total': total_count,
        'labels': labels, 
        'data': data_points
    })
```

## Step 3: The Template (Chart.js)
In `dashboard.html`, add Chart.js via CDN.
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<canvas id="myChart"></canvas>

<!-- Pass Django data safely to JS -->
{{ labels|json_script:"chart-labels" }}
{{ data|json_script:"chart-data" }}

<script>
  const labels = JSON.parse(document.getElementById('chart-labels').textContent);
  const data = JSON.parse(document.getElementById('chart-data').textContent);

  new Chart(document.getElementById('myChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Words Written',
        data: data,
        borderWidth: 1
      }]
    }
  });
</script>
```

## Challenge
Add a "Filter" form to the top of the page (e.g., "Last 7 Days", "Last 30 Days") and update the view to filter the QuerySet accordingly.
