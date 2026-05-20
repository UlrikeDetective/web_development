"""
Zen Breathing Exercise Local Server
Provides static file serving and a SQLite database backend for logging practices.
"""

import http.server
import json
import os
import sqlite3
import socketserver
import sys

# Name of the SQLite database file
DB_FILE = 'zen_breathing.db'
PORT = 8080


def init_db():
    """
    Initializes the SQLite database. Creates the practice_sessions table
    if it doesn't already exist in the database.
    """
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        # Create table with fields: id, timestamp, exercise_name
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS practice_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp INTEGER NOT NULL,
                exercise_name TEXT NOT NULL
            )
        ''')
        conn.commit()
        conn.close()
        print(f"Successfully initialized database file: {DB_FILE}")
    except sqlite3.Error as e:
        print(f"Database initialization error: {e}", file=sys.stderr)


class ZenHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    Custom HTTP Request Handler that serves static files and matches API
    endpoints for getting and posting practice session logs.
    """

    def do_POST(self):
        """
        Handles POST requests.
        API Route: POST /api/sessions
        Saves a new completed breathing exercise session to the SQLite database.
        """
        if self.path == '/api/sessions':
            try:
                # Read POST body content
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                timestamp = data.get('timestamp')
                exercise_name = data.get('exercise_name', 'Unknown Rhythm')
                
                # Input validation
                if not timestamp:
                    self.send_error(400, "Bad Request: Missing timestamp parameter.")
                    return
                
                # Insert session details into database
                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO practice_sessions (timestamp, exercise_name) VALUES (?, ?)",
                    (int(timestamp), str(exercise_name))
                )
                conn.commit()
                conn.close()
                
                # Respond with a successful creation code (201 Created)
                self.send_response(201)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = {"status": "success", "message": "Logged session successfully."}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except json.JSONDecodeError:
                self.send_error(400, "Bad Request: Invalid JSON body format.")
            except (sqlite3.Error, Exception) as e:
                print(f"Server error on POST: {e}", file=sys.stderr)
                self.send_error(500, f"Internal Server Error: {str(e)}")
        else:
            self.send_error(404, "Route Not Found")

    def do_GET(self):
        """
        Handles GET requests.
        API Route: GET /api/sessions
        Retrieves all practice logs from the SQLite database.
        Falls back to serving static files for any other routes.
        """
        if self.path == '/api/sessions':
            try:
                conn = sqlite3.connect(DB_FILE)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                # Query all sessions ordered by timestamp
                cursor.execute(
                    "SELECT timestamp, exercise_name FROM practice_sessions ORDER BY timestamp ASC"
                )
                rows = cursor.fetchall()
                sessions = [
                    {"timestamp": row["timestamp"], "exercise_name": row["exercise_name"]}
                    for row in rows
                ]
                conn.close()
                
                # Send JSON response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(sessions).encode('utf-8'))
                
            except sqlite3.Error as e:
                print(f"Server error on GET: {e}", file=sys.stderr)
                self.send_error(500, f"Database Error: {str(e)}")
        else:
            # Fallback to SimpleHTTPRequestHandler for serving index.html, style.css, script.js
            super().do_GET()

    def do_OPTIONS(self):
        """
        Handles OPTIONS requests to support cross-origin queries (CORS).
        """
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


def run(port=PORT):
    """
    Launches the HTTP socket server serving files on the selected port.
    """
    # Ensure database is configured
    init_db()
    
    # Configure socket server with reusable address port mapping
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), ZenHTTPRequestHandler) as httpd:
        print(f"Zen Breathing server running locally at http://localhost:{port}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
            httpd.shutdown()


if __name__ == '__main__':
    run()
