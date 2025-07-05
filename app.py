#!/usr/bin/env python3
from flask import Flask, render_template, send_from_directory
import os

# Create Flask application
app = Flask(__name__, 
           static_folder='static',
           template_folder='templates')

# Configure Flask
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['DEBUG'] = True

@app.route('/')
def index():
    """Main route - serves the beautiful hello world page"""
    return render_template('index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    """Serve static files (CSS, JS, images)"""
    return send_from_directory('static', filename)

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return {'status': 'healthy', 'message': 'Flask server is running!'}

@app.route('/api/stats')
def get_stats():
    """API endpoint for server stats"""
    return {
        'server': 'Flask',
        'status': 'running',
        'framework': 'Python Flask',
        'auto_refresh': True,
        'refresh_interval': '10 seconds'
    }

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('static/images', exist_ok=True)
    
    print("🚀 Starting Flask Web Application...")
    print("📁 Server running with templates and static files")
    print("🎨 Beautiful UI with auto-refresh enabled")
    print("🔄 Auto-refresh interval: 10 seconds")
    print("📊 Health check available at /health")
    print("🌐 Server will be available at http://localhost:5000")
    
    # Run the Flask application
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=True
    )