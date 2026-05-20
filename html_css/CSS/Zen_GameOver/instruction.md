# Zen Breathing - Instructions & Database Guide

This document describes how to run the Zen Breathing web application and how to access and query the SQLite database (`zen_breathing.db`) containing your practice logs.

---

## 1. Running the Application

The application uses a custom Python backend server to serve static assets and handle the SQLite database API.

### Starting the Server
Open your terminal, navigate to the project directory, and run:
```bash
python3 server.py
```

This starts the server locally. You can open your web browser and navigate to:
**`http://localhost:8080/`**

---

## 2. Database Overview

All breathing practice logs are stored in a local SQLite file named **`zen_breathing.db`** located in the root of the project directory.

### Table Schema
The data is stored in the `practice_sessions` table:
* `id` (INTEGER PRIMARY KEY): Unique identifier for each logged session.
* `timestamp` (INTEGER): Epoch millisecond timestamp of completion.
* `exercise_name` (TEXT): Name of the breathing rhythm completed (e.g., Box Breathing, Deep Calm, Energize, or custom names).

---

## 3. Querying the Database

You can inspect and manage your data directly from the terminal using the command-line SQLite client.

### Connecting to the Database
To open the database console, run:
```bash
sqlite3 zen_breathing.db
```
*(Type `.exit` to exit the SQLite console).*

---

### Useful SQL Queries

Below are helpful queries you can run inside the SQLite console (or run directly from your terminal using `sqlite3 zen_breathing.db "QUERY"`):

#### 1. View All Logged Sessions (Formatted)
Displays all completed practices, converting the millisecond timestamp into a human-readable UTC date and time:
```sql
.headers on
.mode column
SELECT 
    id, 
    datetime(timestamp / 1000, 'unixepoch') AS date_utc, 
    exercise_name 
FROM practice_sessions;
```

#### 2. Get Practice Count by Exercise
Find out which breathing exercises you use the most:
```sql
SELECT 
    exercise_name, 
    COUNT(*) AS total_completed 
FROM practice_sessions 
GROUP BY exercise_name 
ORDER BY total_completed DESC;
```

#### 3. View Sessions Completed Today
Lists all exercises completed on the current calendar day:
```sql
SELECT 
    id, 
    datetime(timestamp / 1000, 'unixepoch') AS date_utc, 
    exercise_name 
FROM practice_sessions 
WHERE date(timestamp / 1000, 'unixepoch') = date('now');
```

#### 4. Find Your Most Recent Session
Shows the last exercise you practiced:
```sql
SELECT 
    id, 
    datetime(timestamp / 1000, 'unixepoch') AS date_utc, 
    exercise_name 
FROM practice_sessions 
ORDER BY timestamp DESC 
LIMIT 1;
```

#### 5. Total Session Count in the Last 7 Days
```sql
SELECT COUNT(*) AS sessions_last_7_days 
FROM practice_sessions 
WHERE timestamp >= (strftime('%s', 'now') - 7 * 86400) * 1000;
```

#### 6. Reset Practice History (Deletes all entries)
*Caution: This permanently deletes your logs.*
```sql
DELETE FROM practice_sessions;
```
