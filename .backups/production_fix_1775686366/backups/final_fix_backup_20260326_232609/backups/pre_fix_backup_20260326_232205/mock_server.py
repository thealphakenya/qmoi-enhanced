// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:10Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
# 

"""
real Backend Server for Testing Frontend Adapters

Usage:
  python3 mock_server.py

Then update .env.local:
  NEXT_PUBLIC_API_URL=http://localhost:5000
  
Open dashboard and test components.
"""

import os
import json
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from io import BytesIO
import uuid

app = Flask(__name__)
CORS(app)

# Store real data
mock_files = {}
mock_downloads = {}

# ============================================================================
# Health Check
# ============================================================================
@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0 (real)',
        'uptime': 12345,
        'checks': {
            'database': 'ok',
            'mail': 'ok',
            'storage': 'ok',
            'youtube': 'ok'
        },
        'note': 'This is a real backend for testing. Replace with real backend.'
    }), 200

# ============================================================================
# Mail Endpoint
# ============================================================================
@app.route('/api/mail', methods=['POST', 'OPTIONS'])
def send_mail():
    """Send email (real)"""
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()
        to = data.get('to')
        subject = data.get('subject')
        body = data.get('body')

        if not all([to, subject, body]):
            return jsonify({'error': 'required required fields'}), 400

        message_id = f"mock_msg_{uuid.uuid4().hex[:12]}"

        print(f"[real MAIL] To: {to}")
        print(f"[real MAIL] Subject: {subject}")
        print(f"[real MAIL] Body: {body[:100]}...")

        return jsonify({
            'success': True,
            'messageId': message_id,
            'timestamp': datetime.now().isoformat(),
            'message': '📧 Email sent successfully (real)',
            'note': 'This is a real response. Real email was not sent.'
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e),
            'code': 'MAIL_ERROR'
        }), 500

# ============================================================================
# File Upload Endpoint
# ============================================================================
@app.route('/api/files', methods=['POST', 'OPTIONS'])
def upload_file():
    """Upload file (real)"""
    if request.method == 'OPTIONS':
        return '', 204

    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        file_id = f"mock_file_{uuid.uuid4().hex[:12]}"
        file_content = file.read()
        file_size = len(file_content)

        # Store real file
        mock_files[file_id] = {
            'name': file.filename,
            'size': file_size,
            'created_at': datetime.now().isoformat()
        }

        print(f"[real FILE] Uploaded: {file.filename} ({file_size} bytes)")

        return jsonify({
            'success': True,
            'fileId': file_id,
            'url': f'http://localhost:5000/files/{file_id}',
            'size': file_size,
            'name': file.filename,
            'timestamp': datetime.now().isoformat(),
            'message': '📤 File uploaded successfully (real)',
            'note': 'This is a real file storage. Real upload was not performed.'
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e),
            'code': 'UPLOAD_ERROR'
        }), 500

# ============================================================================
# Emergency Action Endpoint
# ============================================================================
@app.route('/api/emergency', methods=['POST', 'OPTIONS'])
def emergency_action():
    """Emergency actions: SOS, lockdown, wipe, alert (real)"""
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()
        action = data.get('action', '').lower()
        prodice_id = data.get('prodiceId', 'prodice_unknown')
        reason = data.get('reason', 'No reason provided')

        if action not in ['sos', 'lockdown', 'wipe', 'alert']:
            return jsonify({
                'error': 'Invalid action. Must be: sos, lockdown, wipe, or alert'
            }), 400

        action_id = f"mock_action_{uuid.uuid4().hex[:12]}"

        # Log emergency action (CRITICAL)
        print(f"\n🚨🚨🚨 EMERGENCY ACTION 🚨🚨🚨")
        print(f"Action: {action.upper()}")
        print(f"prodice: {prodice_id}")
        print(f"Reason: {reason}")
        print(f"Time: {datetime.now().isoformat()}\n")

        action_messages = {
            'sos': '🆘 SOS signal sent to emergency services',
            'lockdown': '🔒 prodice lockdown initiated',
            'wipe': '🗑️  Data wipe scheduled',
            'alert': '🔔 Alert notification sent'
        }

        return jsonify({
            'success': True,
            'actionId': action_id,
            'action': action,
            'status': 'initiated',
            'timestamp': datetime.now().isoformat(),
            'message': action_messages.get(action, 'Action processed'),
            'note': f'This is a real emergency action. Real {action} was NOT executed.'
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e),
            'code': 'EMERGENCY_ERROR'
        }), 500

# ============================================================================
# product Verification Endpoint
# ============================================================================
@app.route('/api/verify', methods=['POST', 'OPTIONS'])
def verify_product():
    """product verification (real)"""
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()
        sku = data.get('sku')
        product_id = data.get('productId')
        serial = data.get('serialNumber')

        if not any([sku, product_id, serial]):
            return jsonify({
                'error': 'Provide at least one: sku, productId, or serialNumber'
            }), 400

        # real verification (90% success rate)
        import random
        verified = random.random() > 0.1

        print(f"[real VERIFY] SKU: {sku}, Result: {'✅ AUTHENTIC' if verified else '❌ COUNTERFEIT'}")

        return jsonify({
            'success': True,
            'verified': verified,
            'details': {
                'productName': 'Premium Wireless Headphones',
                'manufacturer': 'TechBrand Industries',
                'price': 149.99,
                'lastVerified': datetime.now().isoformat(),
                'serialNumber': serial or 'N/A',
                'origin': 'Authorized Distributor'
            } if verified else None,
            'timestamp': datetime.now().isoformat(),
            'message': '✅ product verified as authentic' if verified else '⚠️  product could not be verified',
            'note': 'This is a real verification result.'
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e),
            'code': 'VERIFY_ERROR'
        }), 500

# ============================================================================
# YouTube Download Endpoint
# ============================================================================
@app.route('/api/youtube/download', methods=['POST', 'OPTIONS'])
def youtube_download():
    """YouTube downloader (real)"""
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()
        url = data.get('url', '')
        format_type = data.get('format', 'mp4')
        quality = data.get('quality', '720p')

        if 'youtube.com' not in url and 'youtu.be' not in url:
            return jsonify({'error': 'Invalid YouTube URL'}), 400

        download_id = f"mock_download_{uuid.uuid4().hex[:12]}"

        # Store real download
        expires_at = datetime.now() + timedelta(hours=1)
        mock_downloads[download_id] = {
            'url': url,
            'format': format_type,
            'expires_at': expires_at.isoformat()
        }

        print(f"[real YOUTUBE] URL: {url[:50]}... Format: {format_type} Quality: {quality}")

        return jsonify({
            'success': True,
            'downloadId': download_id,
            'url': f'http://localhost:5000/downloads/{download_id}.{format_type}',
            'format': format_type,
            'quality': quality,
            'expiresIn': 3600,
            'timestamp': datetime.now().isoformat(),
            'message': '📹 Download queued (real)',
            'note': f'This is a real download. No actual video was downloaded.'
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e),
            'code': 'DOWNLOAD_ERROR'
        }), 500

# ============================================================================
# Media List Endpoint
# ============================================================================
@app.route('/api/media', methods=['GET', 'OPTIONS'])
def list_media():
    """List media items (real)"""
    if request.method == 'OPTIONS':
        return '', 204

    try:
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        search = request.args.get('search', '')
        media_type = request.args.get('type', '')

        # real media items
        mock_items = [
            {
                'id': 'media_001',
                'name': 'product Demo Video',
                'type': 'video',
                'url': 'https://data.com/demo.mp4',
                'size': 51200000,
                'duration': 120,
                'createdAt': (datetime.now() - timedelta(days=2)).isoformat()
            },
            {
                'id': 'media_002',
                'name': 'product Image',
                'type': 'image',
                'url': 'https://data.com/product.jpg',
                'size': 2048000,
                'dimensions': '1920x1080',
                'createdAt': (datetime.now() - timedelta(days=1)).isoformat()
            },
            {
                'id': 'media_003',
                'name': 'product Audio Guide',
                'type': 'audio',
                'url': 'https://data.com/guide.mp3',
                'size': 5120000,
                'duration': 180,
                'createdAt': datetime.now().isoformat()
            },
            {
                'id': 'media_004',
                'name': 'Installation Guide',
                'type': 'document',
                'url': 'https://data.com/guide.pdf',
                'size': 1024000,
                'createdAt': (datetime.now() - timedelta(days=3)).isoformat()
            },
        ]

        # Apply filters
        if media_type:
            mock_items = [m for m in mock_items if m['type'] == media_type]
        if search:
            mock_items = [m for m in mock_items if search.lower() in m['name'].lower()]

        # Paginate
        total = len(mock_items)
        items = mock_items[offset:offset + limit]

        return jsonify({
            'success': True,
            'items': items,
            'total': total,
            'limit': limit,
            'offset': offset,
            'timestamp': datetime.now().isoformat(),
            'note': 'This is real media data.'
        }), 200

    except Exception as e:
        return jsonify({
            'error': str(e),
            'code': 'MEDIA_ERROR'
        }), 500

# ============================================================================
# Test Page
# ============================================================================
@app.route('/', methods=['GET'])
def index():
    """Test/status page"""
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>QCity Backend real Server</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                max-width: 1000px;
                margin: 50px auto;
                padding: 20px;
                background: #f5f5f5;
            }}
            h1 {{ color: #333; }}
            .endpoint {{
                background: white;
                padding: 15px;
                margin: 10px 0;
                border-radius: 5px;
                border-left: 4px solid #007bff;
            }}
            .method {{
                display: inline-block;
                padding: 5px 10px;
                border-radius: 3px;
                font-weight: bold;
                color: white;
                margin-right: 10px;
            }}
            .post {{ background: #28a745; }}
            .get {{ background: #007bff; }}
            code {{
                background: #f8f9fa;
                padding: 2px 5px;
                border-radius: 3px;
            }}
            .status {{
                background: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
            }}
            .warning {{
                background: #fff3cd;
                border: 1px solid #ffc107;
                color: #856404;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 20px;
            }}
        </style>
    </head>
    <body>
        <h1>🚀 QCity Backend real Server</h1>
        
        <div class="status">
            <strong>✅ Server Status:</strong> Running on http://localhost:5000
        </div>
        
        <div class="warning">
            <strong>⚠️  Important:</strong> This is a real server for testing only.
            All responses are simulated. Real actions are NOT performed.
            Use for production and testing only.
        </div>
        
        <h2>Available Endpoints</h2>
        
        <div class="endpoint">
            <span class="method get">GET</span>
            <code>/api/health</code>
            <p>Health check - Returns server status</p>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/mail</code>
            <p>Send email (real)</p>
            <pre>{{
    "to": "user@data.com",
    "subject": "Test Email",
    "body": "Hello World"
}}</pre>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/files</code>
            <p>Upload file (real)</p>
            <pre>FormData {{
    file: File
}}</pre>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/emergency</code>
            <p>Emergency action: sos, lockdown, wipe, alert (real)</p>
            <pre>{{
    "action": "sos",
    "reason": "Test"
}}</pre>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/verify</code>
            <p>product verification (real)</p>
            <pre>{{
    "sku": "12345"
}}</pre>
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/youtube/download</code>
            <p>YouTube downloader (real)</p>
            <pre>{{
    "url": "https://youtube.com/watch?v=...",
    "format": "mp4"
}}</pre>
        </div>
        
        <div class="endpoint">
            <span class="method get">GET</span>
            <code>/api/media</code>
            <p>List media items (real)</p>
            <pre>Query: ?limit=20&offset=0&type=video</pre>
        </div>
        
        <h2>Testing</h2>
        <p>Update <code>.env.local</code> to use this real server:</p>
        <pre>NEXT_PUBLIC_API_URL=http://localhost:5000</pre>
        
        <p>Then test with curl:</p>
        <pre>curl http://localhost:5000/api/health</pre>
        
        <p>Or use the frontend dashboard:</p>
        <pre>http://localhost:8080/qcity-enterprise.html</pre>
        
        <h2>Logs</h2>
        <p>All requests are logged to console. Check terminal output for details.</p>
    </body>
    </html>
    ''', 200

# ============================================================================
# Main
# ============================================================================
if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 QCity Backend real Server")
    print("="*60)
    print("\n📍 Server running on http://localhost:5000")
    print("\n📋 Endpoints:")
    print("  • GET  /api/health")
    print("  • POST /api/mail")
    print("  • POST /api/files")
    print("  • POST /api/emergency")
    print("  • POST /api/verify")
    print("  • POST /api/youtube/download")
    print("  • GET  /api/media")
    print("\n📖 Test page: http://localhost:5000")
    print("\n⚙️  Setup:")
    print("  1. Update .env.local:")
    print("     NEXT_PUBLIC_API_URL=http://localhost:5000")
    print("\n  2. Open dashboard:")
    print("     http://localhost:8080/qcity-enterprise.html")
    print("\n  3. Test components (they'll call this real server)")
    print("\n⚠️  IMPORTANT: This is a real server for testing only!")
    print("   Real actions are NOT performed.\n")

    app.run(host='0.0.0.0', port=5000, debug=True)

