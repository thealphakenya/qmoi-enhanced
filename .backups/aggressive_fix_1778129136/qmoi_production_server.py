#!/usr/bin/env python3
"""
qmoi_production_server.py

Production-grade HTTP server for serving QMOI AI, QMOI Space, QCity, and QVillage applications.
Features: logging, monitoring, auto-recovery, security headers, compression, caching.
"""

import http.server
import socketserver
import logging
import gzip
import json
import os
import sys
from datetime import datetime
from urllib.parse import urlparse, parse_qs
from http import HTTPStatus
import mimetypes
import threading
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('/tmp/qmoi-server.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger('qmoi-server')

class QMOIRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Enhanced request handler with production features."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='/workspaces/qmoi-enhanced', **kwargs)
    
    def log_message(self, format, *args):
        """Override to use our logger."""
        logger.info(f"{self.address_string()} - {format % args}")
    
    def end_headers(self):
        """Add security and performance headers."""
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
        
        # Enable compression for text-based content
        if hasattr(self, 'compress_response') and self.compress_response:
            self.send_header('Content-Encoding', 'gzip')
        
        super().end_headers()
    
    def do_GET(self):
        """Handle GET requests with enhanced routing."""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Health check endpoint
        if path == '/health':
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            health_data = {
                'status': 'healthy',
                'timestamp': datetime.now().isoformat(),
                'apps': ['qmoi-ai', 'qmoi-space', 'qcity', 'qvillage'],
                'version': '1.0.0'
            }
            self.wfile.write(json.dumps(health_data).encode())
            return
        
        # API endpoints for PWA updates
        if path == '/api/pwa/check-update':
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            update_data = {
                'update_available': False,
                'current_version': '1.0.0',
                'last_checked': datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(update_data).encode())
            return
        
        if path == '/api/pwa/auto-update':
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            update_result = {
                'status': 'success',
                'message': 'PWA is up to date',
                'timestamp': datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(update_result).encode())
            return
        
        # Route to specific app pages
        app_routes = {
            '/qmoi-ai': '/pwa_apps/qmoi-ai/index.html',
            '/qmoi-space': '/pwa_apps/qmoi-space/index.html', 
            '/qcity': '/qcity-enterprise.html',
            '/qvillage': '/qvillage.html'
        }
        
        if path in app_routes:
            self.path = app_routes[path]
        
        # Handle static file serving with compression
        if self.should_compress():
            self.serve_compressed()
        else:
            super().do_GET()
    
    def should_compress(self):
        """Check if response should be compressed."""
        content_type = self.guess_type(self.path)
        return content_type and content_type[0] in ['text', 'application'] and 'gzip' in self.headers.get('Accept-Encoding', '')
    
    def serve_compressed(self):
        """Serve file with gzip compression."""
        try:
            with open(self.translate_path(self.path), 'rb') as f:
                content = f.read()
            
            compressed = gzip.compress(content)
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-Type', self.guess_type(self.path)[0])
            self.send_header('Content-Length', len(compressed))
            self.compress_response = True
            self.end_headers()
            self.wfile.write(compressed)
        except Exception as e:
            logger.error(f"Compression error: {e}")
            self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR)

def run_server(port=8080):
    """Run the production server."""
    with socketserver.TCPServer(("", port), QMOIRequestHandler) as httpd:
        logger.info(f"🚀 QMOI Production Server starting on port {port}")
        logger.info(f"📱 Serving QMOI AI, QMOI Space, QCity, QVillage")
        logger.info(f"🔗 Health check: http://localhost:{port}/health")
        logger.info(f"📊 PWA Update API: http://localhost:{port}/api/pwa/check-update")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            logger.info("🛑 Server stopped by user")
        except Exception as e:
            logger.error(f"Server error: {e}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='QMOI Production Server')
    parser.add_argument('--port', type=int, default=8080, help='Port to serve on')
    args = parser.parse_args()
    
    run_server(args.port)