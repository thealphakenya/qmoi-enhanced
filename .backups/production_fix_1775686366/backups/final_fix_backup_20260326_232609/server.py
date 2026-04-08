// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:32Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
QCity Enterprise HTTP Server
Serves the QCity Enterprise dashboard with proper routing
"""

import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

class QCityHTTPRequestHandler(SimpleHTTPRequestHandler):
    """Custom HTTP handler for QCity that serves the dashboard"""
    
    def do_GET(self):
        """Handle GET requests"""
        # Strip query strings
        path = self.path.split('?')[0]
        
        # Serve qcity-enterprise.html for root path
        if path == '/' or path == '':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            
            # Read and serve the dashboard
            dashboard_path = os.path.join(os.getcwd(), 'qcity-enterprise.html')
            try:
                with open(dashboard_path, 'rb') as f:
                    self.wfile.write(f.read())
                return
            except FileNotFoundError:
                self.send_error(404, 'Dashboard not found')
                return
        
        # For other paths, use the default handler
        super().do_GET()
    
    def end_headers(self):
        """Add cache control headers"""
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Custom logging"""
        print(f"[QCity Server] {format % args}")

def start_server(port=8080):
    """Start the QCity HTTP server"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, QCityHTTPRequestHandler)
    
    print(f"╔════════════════════════════════════════════════════════════╗")
    print(f"║              QCity Enterprise Server Started               ║")
    print(f"╠════════════════════════════════════════════════════════════╣")
    print(f"║  URL: http://localhost:{port}                              ║")
    print(f"║  Dashboard: qcity-enterprise.html                          ║")
    print(f"║  Status: RUNNING                                           ║")
    print(f"╚════════════════════════════════════════════════════════════╝")
    print()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✅ QCity Server stopped")
        sys.exit(0)

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    start_server(port)
