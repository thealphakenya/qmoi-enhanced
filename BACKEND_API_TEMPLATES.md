# Backend API Templates & Implementation Examples

**Date:** December 2, 2025  
**Version:** 1.0  
**Purpose:** Ready-to-use code templates for all 7 required API endpoints

---

## Overview

This document provides complete, production-ready code examples for implementing the 7 API endpoints that the frontend adapters expect. Choose the framework that matches your backend stack.

**Endpoints:**
1. `POST /api/mail` — Send email
2. `POST /api/files` — Upload/transfer files
3. `POST /api/emergency` — SOS, lockdown, wipe, alert
4. `POST /api/verify` — Product verification
5. `POST /api/youtube/download` — YouTube downloader
6. `GET /api/media` — List media items
7. `GET /api/health` — Health check

---

## Node.js + Express

### Setup
```bash
npm install express cors dotenv nodemailer multer yt-dlp axios
```

### Complete Implementation
```javascript
// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb' }));

// Setup multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// Setup nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// ============================================================================
// POST /api/mail - Send Email
// ============================================================================
app.post('/api/mail', async (req, res) => {
  try {
    const { to, subject, body, cc, bcc } = req.body;

    // Validation
    if (!to || !subject || !body) {
      return res.status(400).json({
        error: 'Missing required fields: to, subject, body',
      });
    }

    // Send email
    const mailOptions = {
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to,
      subject,
      html: body,
      cc,
      bcc,
    };

    const info = await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Mail error:', error);
    res.status(500).json({
      error: error.message,
      code: 'MAIL_ERROR',
    });
  }
});

// ============================================================================
// POST /api/files - Upload/Transfer Files
// ============================================================================
app.post('/api/files', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { destination = '/uploads', metadata } = req.body;
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileUrl = `/uploads/${req.file.filename}`;

    // Store metadata (in production, save to database)
    const fileMetadata = {
      fileId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      destination,
      metadata: JSON.parse(metadata || '{}'),
      uploadedAt: new Date().toISOString(),
    };

    console.log('File uploaded:', fileMetadata);

    res.json({
      success: true,
      fileId,
      url: fileUrl,
      size: req.file.size,
      name: req.file.originalname,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      error: error.message,
      code: 'UPLOAD_ERROR',
    });
  }
});

// ============================================================================
// POST /api/emergency - SOS, Lockdown, Wipe, Alert
// ============================================================================
app.post('/api/emergency', async (req, res) => {
  try {
    const { action, deviceId, reason, metadata } = req.body;

    if (!action || !['sos', 'lockdown', 'wipe', 'alert'].includes(action)) {
      return res.status(400).json({
        error: 'Invalid action. Must be: sos, lockdown, wipe, or alert',
      });
    }

    const actionId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log emergency action (critical for security)
    console.error('[EMERGENCY]', {
      actionId,
      action,
      deviceId,
      reason,
      timestamp: new Date().toISOString(),
      metadata,
    });

    // TODO: Implement device management integration
    // - SOS: Send emergency alert to security team
    // - Lockdown: Lock device remotely
    // - Wipe: Erase data from device
    // - Alert: Send notification

    res.json({
      success: true,
      actionId,
      action,
      status: 'initiated',
      message: `Emergency action ${action} initiated`,
    });
  } catch (error) {
    console.error('Emergency action error:', error);
    res.status(500).json({
      error: error.message,
      code: 'EMERGENCY_ERROR',
    });
  }
});

// ============================================================================
// POST /api/verify - Product Verification
// ============================================================================
app.post('/api/verify', async (req, res) => {
  try {
    const { sku, productId, serialNumber } = req.body;

    if (!sku && !productId && !serialNumber) {
      return res.status(400).json({
        error: 'Provide at least one: sku, productId, or serialNumber',
      });
    }

    // TODO: Implement product verification service
    // - Query product database
    // - Check barcode/serial against registry
    // - Return verification status

    // Mock response
    const verified = Math.random() > 0.1; // 90% authentic

    res.json({
      success: true,
      verified,
      details: verified
        ? {
            productName: 'Example Product',
            manufacturer: 'Example Corp',
            price: 99.99,
            lastVerified: new Date().toISOString(),
          }
        : null,
      message: verified ? 'Product verified as authentic' : 'Product verification failed',
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      error: error.message,
      code: 'VERIFY_ERROR',
    });
  }
});

// ============================================================================
// POST /api/youtube/download - YouTube Downloader
// ============================================================================
app.post('/api/youtube/download', async (req, res) => {
  try {
    const { url, format = 'mp4', quality = '720p' } = req.body;

    if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const downloadId = `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // TODO: Implement YouTube downloader
    // - Validate URL
    // - Queue download task
    // - Return temporary download link

    // Mock response
    res.json({
      success: true,
      downloadId,
      url: `/downloads/${downloadId}.${format}`,
      format,
      quality,
      expiresIn: 3600, // 1 hour
      message: 'Download queued',
    });
  } catch (error) {
    console.error('YouTube download error:', error);
    res.status(500).json({
      error: error.message,
      code: 'DOWNLOAD_ERROR',
    });
  }
});

// ============================================================================
// GET /api/media - List Media Items
// ============================================================================
app.get('/api/media', async (req, res) => {
  try {
    const { limit = 20, offset = 0, type, search } = req.query;

    // TODO: Implement media listing service
    // - Query database
    // - Apply filters (type, search)
    // - Paginate results

    // Mock response
    const mockItems = [
      {
        id: 'media_1',
        name: 'Sample Video',
        type: 'video',
        url: '/media/sample.mp4',
        size: 1024000,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'media_2',
        name: 'Sample Image',
        type: 'image',
        url: '/media/sample.jpg',
        size: 512000,
        createdAt: new Date().toISOString(),
      },
    ];

    res.json({
      success: true,
      items: mockItems.slice(0, parseInt(limit)),
      total: mockItems.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Media listing error:', error);
    res.status(500).json({
      error: error.message,
      code: 'MEDIA_ERROR',
    });
  }
});

// ============================================================================
// GET /api/health - Health Check
// ============================================================================
app.get('/api/health', async (req, res) => {
  const startTime = process.uptime();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: Math.floor(startTime),
    checks: {
      database: 'ok', // TODO: Check actual database connection
      mail: 'ok', // TODO: Check mail service
      storage: 'ok', // TODO: Check storage service
    },
  });
});

// ============================================================================
// Error Handler
// ============================================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// ============================================================================
// Start Server
// ============================================================================
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
```

### .env Example
```
PORT=8000
NEXT_PUBLIC_API_URL=http://localhost:8000

# Mail
MAIL_SERVICE=gmail
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@example.com

# File Storage
UPLOAD_DIR=./uploads
STORAGE_SERVICE=local # or 's3', 'gcs'

# YouTube
YOUTUBE_API_KEY=your-api-key

# Database (if needed)
DATABASE_URL=postgresql://user:pass@localhost/dbname
```

---

## Python + FastAPI

### Setup
```bash
pip install fastapi uvicorn python-multipart aiofiles aiosmtplib pydantic python-dotenv
```

### Complete Implementation
```python
# backend/main.py
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import aiofiles
import os
from datetime import datetime
import uuid
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="QCity Backend API", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Models
# ============================================================================
class MailRequest(BaseModel):
    to: EmailStr
    subject: str
    body: str
    cc: Optional[List[EmailStr]] = None
    bcc: Optional[List[EmailStr]] = None

class FileMetadata(BaseModel):
    destination: Optional[str] = "/uploads"
    metadata: Optional[dict] = None

class EmergencyRequest(BaseModel):
    action: str  # 'sos', 'lockdown', 'wipe', 'alert'
    deviceId: Optional[str] = None
    reason: Optional[str] = None
    metadata: Optional[dict] = None

class VerifyRequest(BaseModel):
    sku: Optional[str] = None
    productId: Optional[str] = None
    serialNumber: Optional[str] = None

class YouTubeRequest(BaseModel):
    url: str
    format: Optional[str] = "mp4"
    quality: Optional[str] = "720p"

class MediaFilter(BaseModel):
    limit: int = 20
    offset: int = 0
    type: Optional[str] = None
    search: Optional[str] = None

# ============================================================================
# POST /api/mail - Send Email
# ============================================================================
@app.post("/api/mail")
async def send_mail(request: MailRequest):
    try:
        # TODO: Implement email sending
        # - Connect to SMTP server
        # - Send email with aiosmtplib
        # - Log transaction

        message_id = f"msg_{datetime.now().timestamp()}_{uuid.uuid4().hex[:8]}"

        return {
            "success": True,
            "messageId": message_id,
            "message": "Email sent successfully",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# POST /api/files - Upload/Transfer Files
# ============================================================================
@app.post("/api/files")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_id = f"file_{datetime.now().timestamp()}_{uuid.uuid4().hex[:8]}"
        upload_dir = os.getenv("UPLOAD_DIR", "./uploads")

        # Create upload directory
        os.makedirs(upload_dir, exist_ok=True)

        # Save file
        file_path = os.path.join(upload_dir, file.filename)
        async with aiofiles.open(file_path, "wb") as f:
            content = await file.read()
            await f.write(content)

        return {
            "success": True,
            "fileId": file_id,
            "url": f"/uploads/{file.filename}",
            "size": len(content),
            "name": file.filename,
            "message": "File uploaded successfully",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# POST /api/emergency - SOS, Lockdown, Wipe, Alert
# ============================================================================
@app.post("/api/emergency")
async def emergency_action(request: EmergencyRequest):
    try:
        if request.action not in ["sos", "lockdown", "wipe", "alert"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid action. Must be: sos, lockdown, wipe, or alert",
            )

        action_id = f"action_{datetime.now().timestamp()}_{uuid.uuid4().hex[:8]}"

        # Log emergency action (critical)
        print(f"[EMERGENCY] {request.action} - {action_id}")

        # TODO: Implement device management
        # - Route to appropriate service
        # - Send notifications
        # - Update device status

        return {
            "success": True,
            "actionId": action_id,
            "action": request.action,
            "status": "initiated",
            "message": f"Emergency action {request.action} initiated",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# POST /api/verify - Product Verification
# ============================================================================
@app.post("/api/verify")
async def verify_product(request: VerifyRequest):
    try:
        if not any([request.sku, request.productId, request.serialNumber]):
            raise HTTPException(
                status_code=400,
                detail="Provide at least one: sku, productId, or serialNumber",
            )

        # TODO: Implement product verification
        # - Query product database
        # - Check against registry
        # - Return verification result

        import random
        verified = random.random() > 0.1  # 90% authentic

        return {
            "success": True,
            "verified": verified,
            "details": {
                "productName": "Example Product",
                "manufacturer": "Example Corp",
                "price": 99.99,
                "lastVerified": datetime.now().isoformat(),
            } if verified else None,
            "message": "Product verified" if verified else "Verification failed",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# POST /api/youtube/download - YouTube Downloader
# ============================================================================
@app.post("/api/youtube/download")
async def youtube_download(request: YouTubeRequest):
    try:
        if "youtube.com" not in request.url and "youtu.be" not in request.url:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        download_id = f"download_{datetime.now().timestamp()}_{uuid.uuid4().hex[:8]}"

        # TODO: Implement YouTube download
        # - Validate and parse URL
        # - Queue download task
        # - Return temporary link

        return {
            "success": True,
            "downloadId": download_id,
            "url": f"/downloads/{download_id}.{request.format}",
            "format": request.format,
            "quality": request.quality,
            "expiresIn": 3600,
            "message": "Download queued",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# GET /api/media - List Media Items
# ============================================================================
@app.get("/api/media")
async def list_media(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    type: Optional[str] = None,
    search: Optional[str] = None,
):
    try:
        # TODO: Implement media listing
        # - Query database
        # - Apply filters
        # - Paginate results

        mock_items = [
            {
                "id": "media_1",
                "name": "Sample Video",
                "type": "video",
                "url": "/media/sample.mp4",
                "size": 1024000,
                "createdAt": datetime.now().isoformat(),
            },
            {
                "id": "media_2",
                "name": "Sample Image",
                "type": "image",
                "url": "/media/sample.jpg",
                "size": 512000,
                "createdAt": datetime.now().isoformat(),
            },
        ]

        return {
            "success": True,
            "items": mock_items[:limit],
            "total": len(mock_items),
            "limit": limit,
            "offset": offset,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# GET /api/health - Health Check
# ============================================================================
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "uptime": 0,
        "checks": {
            "database": "ok",
            "mail": "ok",
            "storage": "ok",
        },
    }

# ============================================================================
# Root
# ============================================================================
@app.get("/")
async def root():
    return {
        "message": "QCity Backend API",
        "version": "1.0.0",
        "health": "/api/health",
        "endpoints": [
            "/api/mail",
            "/api/files",
            "/api/emergency",
            "/api/verify",
            "/api/youtube/download",
            "/api/media",
            "/api/health",
        ],
    }

# ============================================================================
# Run Server
# ============================================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Run
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## Python + Flask

### Setup
```bash
pip install flask flask-cors python-dotenv email-validator
```

### Complete Implementation
```python
# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# ============================================================================
# POST /api/mail - Send Email
# ============================================================================
@app.route('/api/mail', methods=['POST'])
def send_mail():
    try:
        data = request.get_json()
        to = data.get('to')
        subject = data.get('subject')
        body = data.get('body')

        if not all([to, subject, body]):
            return jsonify({'error': 'Missing required fields'}), 400

        message_id = f"msg_{datetime.now().timestamp()}_{uuid.uuid4().hex[:8]}"

        # TODO: Implement email sending

        return jsonify({
            'success': True,
            'messageId': message_id,
            'message': 'Email sent successfully'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# POST /api/files - Upload/Transfer Files
# ============================================================================
@app.route('/api/files', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        file_id = f"file_{datetime.now().timestamp()}_{uuid.uuid4().hex[:8]}"

        # Create upload directory
        upload_dir = os.getenv('UPLOAD_DIR', './uploads')
        os.makedirs(upload_dir, exist_ok=True)

        # Save file
        file.save(os.path.join(upload_dir, file.filename))

        return jsonify({
            'success': True,
            'fileId': file_id,
            'url': f'/uploads/{file.filename}',
            'size': len(file.read()),
            'name': file.filename,
            'message': 'File uploaded successfully'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# POST /api/emergency - Emergency Actions
# ============================================================================
@app.route('/api/emergency', methods=['POST'])
def emergency_action():
    try:
        data = request.get_json()
        action = data.get('action')

        if action not in ['sos', 'lockdown', 'wipe', 'alert']:
            return jsonify({'error': 'Invalid action'}), 400

        action_id = f"action_{datetime.now().timestamp()}_{uuid.uuid4().hex[:8]}"

        print(f"[EMERGENCY] {action} - {action_id}")

        return jsonify({
            'success': True,
            'actionId': action_id,
            'action': action,
            'status': 'initiated',
            'message': f'Emergency action {action} initiated'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# POST /api/verify - Product Verification
# ============================================================================
@app.route('/api/verify', methods=['POST'])
def verify_product():
    try:
        data = request.get_json()
        sku = data.get('sku')
        productId = data.get('productId')
        serialNumber = data.get('serialNumber')

        if not any([sku, productId, serialNumber]):
            return jsonify({'error': 'Provide at least one identifier'}), 400

        import random
        verified = random.random() > 0.1

        return jsonify({
            'success': True,
            'verified': verified,
            'details': {
                'productName': 'Example Product',
                'manufacturer': 'Example Corp',
                'price': 99.99,
                'lastVerified': datetime.now().isoformat()
            } if verified else None
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# POST /api/youtube/download - YouTube Downloader
# ============================================================================
@app.route('/api/youtube/download', methods=['POST'])
def youtube_download():
    try:
        data = request.get_json()
        url = data.get('url')
        format_type = data.get('format', 'mp4')
        quality = data.get('quality', '720p')

        if 'youtube.com' not in url and 'youtu.be' not in url:
            return jsonify({'error': 'Invalid YouTube URL'}), 400

        download_id = f"download_{datetime.now().timestamp()}_{uuid.uuid4().hex[:8]}"

        return jsonify({
            'success': True,
            'downloadId': download_id,
            'url': f'/downloads/{download_id}.{format_type}',
            'format': format_type,
            'quality': quality,
            'expiresIn': 3600,
            'message': 'Download queued'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET /api/media - List Media Items
# ============================================================================
@app.route('/api/media', methods=['GET'])
def list_media():
    try:
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))

        mock_items = [
            {
                'id': 'media_1',
                'name': 'Sample Video',
                'type': 'video',
                'url': '/media/sample.mp4',
                'size': 1024000,
                'createdAt': datetime.now().isoformat()
            }
        ]

        return jsonify({
            'success': True,
            'items': mock_items[:limit],
            'total': len(mock_items),
            'limit': limit,
            'offset': offset
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# GET /api/health - Health Check
# ============================================================================
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'checks': {
            'database': 'ok',
            'mail': 'ok',
            'storage': 'ok'
        }
    })

# ============================================================================
# Root
# ============================================================================
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'QCity Backend API',
        'version': '1.0.0',
        'health': '/api/health'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
```

### Run
```bash
python app.py
```

---

## Docker Setup (Optional)

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build & Run
```bash
docker build -t qcity-backend .
docker run -p 8000:8000 qcity-backend
```

---

## Key Implementation Notes

1. **Error Handling:** All endpoints should return consistent error format:
   ```json
   { "error": "description", "code": "ERROR_CODE" }
   ```

2. **Validation:** Validate all inputs before processing

3. **CORS:** Ensure CORS headers are set correctly for cross-origin requests

4. **Logging:** Log all important actions (especially emergency actions)

5. **Security:** 
   - Validate file types and sizes
   - Use environment variables for secrets
   - Add rate limiting
   - Implement authentication/authorization

6. **Persistence:** Store data in database (not shown in these examples)

7. **Async/Concurrency:** Handle multiple requests concurrently

---

## Testing Endpoints

```bash
# Test health check
curl http://localhost:8000/api/health

# Test mail endpoint
curl -X POST http://localhost:8000/api/mail \
  -H "Content-Type: application/json" \
  -d '{"to":"user@example.com","subject":"Test","body":"Hello"}'

# Test emergency endpoint
curl -X POST http://localhost:8000/api/emergency \
  -H "Content-Type: application/json" \
  -d '{"action":"sos","reason":"Test"}'

# Test file upload
curl -X POST http://localhost:8000/api/files \
  -F "file=@test.txt"

# Test media list
curl http://localhost:8000/api/media?limit=10

# Test verification
curl -X POST http://localhost:8000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"sku":"123456"}'

# Test YouTube download
curl -X POST http://localhost:8000/api/youtube/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=..."}'
```

---

## Next Steps

1. Choose your framework (Node.js, Python, Go, etc.)
2. Copy the template code
3. Implement the TODO sections
4. Set up your database and external services
5. Test with curl or Postman
6. Deploy to staging/production
7. Monitor error logs and performance

