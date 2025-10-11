#!/usr/bin/env python3
"""
QMOI Space Backend API
=====================

Advanced backend API for QMOI Space with:
- AI Chat and generation services
- Gaming platform management
- Revenue tracking and analytics
- Project management
- Real-time notifications
- Cloud integration

Author: QMOI AI
Version: 2.0.0
Date: 2025-01-22
"""

import os
import sys
import json
import time
import logging
import asyncio
import aiohttp
import aiofiles
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union
import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, Field
import psutil
import platform
import hashlib
import jwt
from passlib.context import CryptContext
import redis
import sqlite3
from concurrent.futures import ThreadPoolExecutor
import threading
import queue
import websockets
import ssl
import certifi

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('qmoi_space_backend.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Constants
PROJECT_ROOT = Path(__file__).parent.parent
API_VERSION = "2.0.0"
JWT_SECRET = os.getenv("JWT_SECRET", "qmoi-space-secret-key")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database and Cache
DATABASE_URL = "sqlite:///./qmoi_space.db"
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Initialize FastAPI app
app = FastAPI(
    title="QMOI Space API",
    description="Advanced AI Platform Backend API",
    version=API_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Static files
app.mount("/static", StaticFiles(directory="qmoi-space-pwa"), name="static")

# Global variables
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
redis_client = None
db_connection = None
websocket_connections = []
ai_models = {}
background_tasks = {}

# Pydantic models
class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=4096)
    temperature: float = Field(0.7, ge=0.1, le=2.0)
    max_length: int = Field(2048, ge=100, le=4096)
    top_p: float = Field(0.9, ge=0.1, le=1.0)
    repetition_penalty: float = Field(1.1, ge=1.0, le=2.0)

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime
    model_info: Dict[str, Any]
    usage: Dict[str, int]

class RevenueData(BaseModel):
    amount: float
    currency: str = "KSH"
    source: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None

class ProjectData(BaseModel):
    name: str
    description: str
    status: str
    progress: int = Field(0, ge=0, le=100)
    technologies: List[str] = []
    created_at: datetime
    updated_at: datetime

class GameData(BaseModel):
    name: str
    description: str
    category: str
    players: int
    rating: float = Field(0.0, ge=0.0, le=5.0)
    status: str = "active"

class SystemStatus(BaseModel):
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    network_latency: float
    uptime: float
    timestamp: datetime

class NotificationData(BaseModel):
    title: str
    message: str
    type: str = "info"  # info, success, warning, error
    timestamp: datetime
    read: bool = False

# Database models
class DatabaseManager:
    def __init__(self, db_path: str = "qmoi_space.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize database tables"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create tables
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    hashed_password TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_login TIMESTAMP
                )
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chat_messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    message TEXT NOT NULL,
                    response TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    model_config TEXT,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS revenue_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    amount REAL NOT NULL,
                    currency TEXT DEFAULT 'KSH',
                    source TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    metadata TEXT
                )
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    status TEXT DEFAULT 'active',
                    progress INTEGER DEFAULT 0,
                    technologies TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS games (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    category TEXT,
                    players INTEGER DEFAULT 0,
                    rating REAL DEFAULT 0.0,
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS notifications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    title TEXT NOT NULL,
                    message TEXT NOT NULL,
                    type TEXT DEFAULT 'info',
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    read BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            """)
            
            conn.commit()
            conn.close()
            
            logger.info("Database initialized successfully")
            
        except Exception as e:
            logger.error(f"Database initialization failed: {e}")
            raise
    
    def get_connection(self):
        """Get database connection"""
        return sqlite3.connect(self.db_path)

# Initialize database
db_manager = DatabaseManager()

# AI Models Manager
class AIModelsManager:
    def __init__(self):
        self.models = {}
        self.load_models()
    
    def load_models(self):
        """Load AI models"""
        try:
            # This would load actual AI models
            # For now, we'll use [PRODUCTION IMPLEMENTATION REQUIRED] models
            self.models = {
                "qmoi-master": {
                    "name": "QMOI Master",
                    "type": "generative",
                    "max_length": 4096,
                    "temperature": 0.7,
                    "loaded": True
                },
                "qmoi-coding": {
                    "name": "QMOI Coding Assistant",
                    "type": "code_generation",
                    "max_length": 2048,
                    "temperature": 0.3,
                    "loaded": True
                },
                "qmoi-gaming": {
                    "name": "QMOI Gaming AI",
                    "type": "gaming",
                    "max_length": 1024,
                    "temperature": 0.8,
                    "loaded": True
                }
            }
            
            logger.info("AI models loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load AI models: {e}")
    
    async def generate_response(self, model_name: str, prompt: str, config: Dict[str, Any]) -> str:
        """Generate AI response"""
        try:
            if model_name not in self.models:
                raise ValueError(f"Model {model_name} not found")
            
            model = self.models[model_name]
            
            # [PRODUCTION IMPLEMENTATION REQUIRED] response generation
            # In a real implementation, this would call the actual AI model
            response = f"AI Response from {model['name']}: {prompt[:100]}..."
            
            # Simulate processing time
            await asyncio.sleep(0.1)
            
            return response
            
        except Exception as e:
            logger.error(f"AI generation failed: {e}")
            raise
    
    def get_model_info(self, model_name: str) -> Dict[str, Any]:
        """Get model information"""
        if model_name not in self.models:
            return {}
        
        return self.models[model_name]

# Initialize AI models
ai_models_manager = AIModelsManager()

# Revenue Manager
class RevenueManager:
    def __init__(self):
        self.daily_target = 200000  # KSH
        self.revenue_sources = [
            "gaming",
            "content_creation",
            "software_development",
            "ai_services",
            "consulting",
            "licensing"
        ]
    
    async def add_revenue(self, revenue_data: RevenueData) -> bool:
        """Add revenue entry"""
        try:
            conn = db_manager.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO revenue_data (amount, currency, source, timestamp, metadata)
                VALUES (?, ?, ?, ?, ?)
            """, (
                revenue_data.amount,
                revenue_data.currency,
                revenue_data.source,
                revenue_data.timestamp,
                json.dumps(revenue_data.metadata) if revenue_data.metadata else None
            ))
            
            conn.commit()
            conn.close()
            
            # Update real-time revenue
            await self.update_realtime_revenue()
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to add revenue: {e}")
            return False
    
    async def get_revenue_overview(self) -> Dict[str, Any]:
        """Get revenue overview"""
        try:
            conn = db_manager.get_connection()
            cursor = conn.cursor()
            
            # Today's revenue
            cursor.execute("""
                SELECT SUM(amount) FROM revenue_data
                WHERE DATE(timestamp) = DATE('now')
            """)
            today_revenue = cursor.fetchone()[0] or 0
            
            # This month's revenue
            cursor.execute("""
                SELECT SUM(amount) FROM revenue_data
                WHERE strftime('%Y-%m', timestamp) = strftime('%Y-%m', 'now')
            """)
            month_revenue = cursor.fetchone()[0] or 0
            
            # Revenue by source
            cursor.execute("""
                SELECT source, SUM(amount) as total
                FROM revenue_data
                WHERE DATE(timestamp) = DATE('now')
                GROUP BY source
            """)
            revenue_by_source = dict(cursor.fetchall())
            
            # Revenue trend (last 7 days)
            cursor.execute("""
                SELECT DATE(timestamp) as date, SUM(amount) as total
                FROM revenue_data
                WHERE timestamp >= datetime('now', '-7 days')
                GROUP BY DATE(timestamp)
                ORDER BY date
            """)
            revenue_trend = cursor.fetchall()
            
            conn.close()
            
            return {
                "today": today_revenue,
                "month": month_revenue,
                "daily_target": self.daily_target,
                "target_progress": (today_revenue / self.daily_target) * 100,
                "by_source": revenue_by_source,
                "trend": revenue_trend
            }
            
        except Exception as e:
            logger.error(f"Failed to get revenue overview: {e}")
            return {}
    
    async def update_realtime_revenue(self):
        """Update real-time revenue data"""
        try:
            # This would update real-time revenue tracking
            # For now, just log
            logger.info("Real-time revenue updated")
            
        except Exception as e:
            logger.error(f"Failed to update real-time revenue: {e}")

# Initialize revenue manager
revenue_manager = RevenueManager()

# Project Manager
class ProjectManager:
    def __init__(self):
        self.projects = {}
        self.load_projects()
    
    def load_projects(self):
        """Load projects from database"""
        try:
            conn = db_manager.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("SELECT * FROM projects")
            projects = cursor.fetchall()
            
            for project in projects:
                self.projects[project[0]] = {
                    "id": project[0],
                    "name": project[1],
                    "description": project[2],
                    "status": project[3],
                    "progress": project[4],
                    "technologies": json.loads(project[5]) if project[5] else [],
                    "created_at": project[6],
                    "updated_at": project[7]
                }
            
            conn.close()
            
        except Exception as e:
            logger.error(f"Failed to load projects: {e}")
    
    async def create_project(self, project_data: ProjectData) -> int:
        """Create new project"""
        try:
            conn = db_manager.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO projects (name, description, status, progress, technologies, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                project_data.name,
                project_data.description,
                project_data.status,
                project_data.progress,
                json.dumps(project_data.technologies),
                project_data.created_at,
                project_data.updated_at
            ))
            
            project_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            # Update local cache
            self.projects[project_id] = project_data.dict()
            
            return project_id
            
        except Exception as e:
            logger.error(f"Failed to create project: {e}")
            raise
    
    async def get_projects(self) -> List[Dict[str, Any]]:
        """Get all projects"""
        return list(self.projects.values())
    
    async def update_project(self, project_id: int, updates: Dict[str, Any]) -> bool:
        """Update project"""
        try:
            conn = db_manager.get_connection()
            cursor = conn.cursor()
            
            set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
            values = list(updates.values()) + [project_id]
            
            cursor.execute(f"""
                UPDATE projects SET {set_clause}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, values)
            
            conn.commit()
            conn.close()
            
            # Update local cache
            if project_id in self.projects:
                self.projects[project_id].update(updates)
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to update project: {e}")
            return False

# Initialize project manager
project_manager = ProjectManager()

# Gaming Manager
class GamingManager:
    def __init__(self):
        self.games = {}
        self.active_games = {}
        self.load_games()
    
    def load_games(self):
        """Load games from database"""
        try:
            conn = db_manager.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("SELECT * FROM games")
            games = cursor.fetchall()
            
            for game in games:
                self.games[game[0]] = {
                    "id": game[0],
                    "name": game[1],
                    "description": game[2],
                    "category": game[3],
                    "players": game[4],
                    "rating": game[5],
                    "status": game[6],
                    "created_at": game[7]
                }
            
            conn.close()
            
        except Exception as e:
            logger.error(f"Failed to load games: {e}")
    
    async def get_games(self) -> List[Dict[str, Any]]:
        """Get all games"""
        return list(self.games.values())
    
    async def start_game(self, game_id: int, player_id: str) -> bool:
        """Start a game session"""
        try:
            if game_id not in self.games:
                return False
            
            game = self.games[game_id]
            session_id = f"{game_id}_{player_id}_{int(time.time())}"
            
            self.active_games[session_id] = {
                "game_id": game_id,
                "player_id": player_id,
                "started_at": datetime.now(),
                "status": "active"
            }
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to start game: {e}")
            return False
    
    async def end_game(self, session_id: str) -> bool:
        """End a game session"""
        try:
            if session_id in self.active_games:
                del self.active_games[session_id]
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Failed to end game: {e}")
            return False

# Initialize gaming manager
gaming_manager = GamingManager()

# Notification Manager
class NotificationManager:
    def __init__(self):
        self.notifications = {}
        self.websocket_connections = []
    
    async def send_notification(self, notification: NotificationData, user_id: Optional[int] = None):
        """Send notification"""
        try:
            # Save to database
            conn = db_manager.get_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO notifications (user_id, title, message, type, timestamp, read)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                notification.title,
                notification.message,
                notification.type,
                notification.timestamp,
                notification.read
            ))
            
            conn.commit()
            conn.close()
            
            # Send via WebSocket
            await self.broadcast_notification(notification.dict())
            
        except Exception as e:
            logger.error(f"Failed to send notification: {e}")
    
    async def broadcast_notification(self, notification: Dict[str, Any]):
        """Broadcast notification to all connected clients"""
        if self.websocket_connections:
            message = json.dumps({
                "type": "notification",
                "data": notification
            })
            
            for connection in self.websocket_connections:
                try:
                    await connection.send_text(message)
                except:
                    # Remove disconnected clients
                    self.websocket_connections.remove(connection)

# Initialize notification manager
notification_manager = NotificationManager()

# API Routes
@app.get("/")
async def root():
    """Root endpoint - serve PWA"""
    return HTMLResponse(open("qmoi-space-pwa/index.html").read())

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": API_VERSION,
        "uptime": time.time()
    }

@app.get("/api/system/status")
async def get_system_status():
    """Get system status"""
    try:
        status = SystemStatus(
            cpu_usage=psutil.cpu_percent(interval=1),
            memory_usage=psutil.virtual_memory().percent,
            disk_usage=psutil.disk_usage('/').percent,
            network_latency=0.0,  # Would implement actual network latency check
            uptime=time.time(),
            timestamp=datetime.now()
        )
        
        return status.dict()
        
    except Exception as e:
        logger.error(f"Failed to get system status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get system status")

@app.post("/api/chat/generate")
async def generate_chat_response(message: ChatMessage):
    """Generate AI chat response"""
    try:
        # Generate response using AI model
        response = await ai_models_manager.generate_response(
            "qmoi-master",
            message.message,
            {
                "temperature": message.temperature,
                "max_length": message.max_length,
                "top_p": message.top_p,
                "repetition_penalty": message.repetition_penalty
            }
        )
        
        # Save to database
        conn = db_manager.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO chat_messages (user_id, message, response, model_config)
            VALUES (?, ?, ?, ?)
        """, (
            1,  # Default user ID
            message.message,
            response,
            json.dumps(message.dict())
        ))
        
        conn.commit()
        conn.close()
        
        return ChatResponse(
            response=response,
            timestamp=datetime.now(),
            model_info=ai_models_manager.get_model_info("qmoi-master"),
            usage={"tokens": len(response.split())}
        )
        
    except Exception as e:
        logger.error(f"Failed to generate chat response: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate response")

@app.get("/api/revenue/overview")
async def get_revenue_overview():
    """Get revenue overview"""
    try:
        overview = await revenue_manager.get_revenue_overview()
        return overview
        
    except Exception as e:
        logger.error(f"Failed to get revenue overview: {e}")
        raise HTTPException(status_code=500, detail="Failed to get revenue overview")

@app.post("/api/revenue/add")
async def add_revenue(revenue_data: RevenueData):
    """Add revenue entry"""
    try:
        success = await revenue_manager.add_revenue(revenue_data)
        
        if success:
            return {"status": "success", "message": "Revenue added successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to add revenue")
            
    except Exception as e:
        logger.error(f"Failed to add revenue: {e}")
        raise HTTPException(status_code=500, detail="Failed to add revenue")

@app.get("/api/projects")
async def get_projects():
    """Get all projects"""
    try:
        projects = await project_manager.get_projects()
        return {"projects": projects}
        
    except Exception as e:
        logger.error(f"Failed to get projects: {e}")
        raise HTTPException(status_code=500, detail="Failed to get projects")

@app.post("/api/projects")
async def create_project(project_data: ProjectData):
    """Create new project"""
    try:
        project_id = await project_manager.create_project(project_data)
        return {"status": "success", "project_id": project_id}
        
    except Exception as e:
        logger.error(f"Failed to create project: {e}")
        raise HTTPException(status_code=500, detail="Failed to create project")

@app.get("/api/games")
async def get_games():
    """Get all games"""
    try:
        games = await gaming_manager.get_games()
        return {"games": games}
        
    except Exception as e:
        logger.error(f"Failed to get games: {e}")
        raise HTTPException(status_code=500, detail="Failed to get games")

@app.post("/api/games/{game_id}/start")
async def start_game(game_id: int, player_id: str):
    """Start a game"""
    try:
        success = await gaming_manager.start_game(game_id, player_id)
        
        if success:
            return {"status": "success", "message": "Game started successfully"}
        else:
            raise HTTPException(status_code=400, detail="Failed to start game")
            
    except Exception as e:
        logger.error(f"Failed to start game: {e}")
        raise HTTPException(status_code=500, detail="Failed to start game")

@app.get("/api/analytics/overview")
async def get_analytics_overview():
    """Get analytics overview"""
    try:
        # This would return comprehensive analytics
        return {
            "users": {
                "total": 1250,
                "active": 890,
                "new_today": 45
            },
            "revenue": {
                "today": 45230,
                "this_month": 1245600,
                "growth": 23.5
            },
            "performance": {
                "uptime": 99.9,
                "response_time": 120,
                "error_rate": 0.1
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get analytics overview: {e}")
        raise HTTPException(status_code=500, detail="Failed to get analytics")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time communication"""
    await websocket.accept()
    notification_manager.websocket_connections.append(websocket)
    
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
            elif message.get("type") == "subscribe":
                # Handle subscription to specific data
                pass
            
    except WebSocketDisconnect:
        notification_manager.websocket_connections.remove(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        notification_manager.websocket_connections.remove(websocket)

# Background tasks
@app.on_event("startup")
async def startup_event():
    """Startup event"""
    logger.info("QMOI Space Backend starting up...")
    
    # Initialize Redis connection
    global redis_client
    try:
        redis_client = redis.Redis.from_url(REDIS_URL)
        redis_client.ping()
        logger.info("Redis connection established")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}")
    
    # Start background tasks
    asyncio.create_task(background_revenue_update())
    asyncio.create_task(background_system_monitoring())
    
    logger.info("QMOI Space Backend started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event"""
    logger.info("QMOI Space Backend shutting down...")
    
    # Close database connections
    if db_connection:
        db_connection.close()
    
    # Close Redis connection
    if redis_client:
        redis_client.close()
    
    logger.info("QMOI Space Backend shutdown complete")

# Background task functions
async def background_revenue_update():
    """Background task to update revenue data"""
    while True:
        try:
            await revenue_manager.update_realtime_revenue()
            await asyncio.sleep(60)  # Update every minute
        except Exception as e:
            logger.error(f"Background revenue update failed: {e}")
            await asyncio.sleep(60)

async def background_system_monitoring():
    """Background task to monitor system status"""
    while True:
        try:
            # Monitor system and send notifications if needed
            cpu_usage = psutil.cpu_percent(interval=1)
            memory_usage = psutil.virtual_memory().percent
            
            if cpu_usage > 90 or memory_usage > 90:
                notification = NotificationData(
                    title="High Resource Usage",
                    message=f"CPU: {cpu_usage}%, Memory: {memory_usage}%",
                    type="warning",
                    timestamp=datetime.now()
                )
                await notification_manager.send_notification(notification)
            
            await asyncio.sleep(30)  # Check every 30 seconds
        except Exception as e:
            logger.error(f"Background system monitoring failed: {e}")
            await asyncio.sleep(30)

# Main function
def main():
    """Main function to run the server"""
    try:
        logger.info("Starting QMOI Space Backend Server...")
        
        uvicorn.run(
            "qmoi_space_backend:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
        
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()


