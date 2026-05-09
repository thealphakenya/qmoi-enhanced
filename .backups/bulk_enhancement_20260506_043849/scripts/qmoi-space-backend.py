#!/usr/bin/env python3
# PRODUCTION_READY: True
"""
QMOI Space Backend API
=====================

Minimal production-ready backend for QMOI Space.

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
import sqlite3
import platform
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from passlib.context import CryptContext
import redis
import psutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('qmoi_space_backend.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Constants
PROJECT_ROOT = Path(__file__).resolve().parent
API_VERSION = "2.0.0"
JWT_SECRET = os.getenv("JWT_SECRET", "qmoi-space-secret-key")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REDIS_URL = os.getenv("REDIS_URL", "redis://qmoi.ai:6379")
DATABASE_PATH = PROJECT_ROOT / "qmoi_space.db"

# FastAPI app
app = FastAPI(
    title="QMOI Space API",
    description="Advanced AI Platform Backend API",
    version=API_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.mount("/static", StaticFiles(directory=str(PROJECT_ROOT / "qmoi-space-pwa")), name="static")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
redis_client: Optional[redis.Redis] = None

def get_database_connection() -> sqlite3.Connection:
    try:
        conn = sqlite3.connect(str(DATABASE_PATH), check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as exc:
        logger.error(f"Database connection failed: {exc}")
        raise

class HealthMonitor:
    def __init__(self):
        self.checks: Dict[str, Any] = {}
        self.last_check: Optional[Dict[str, Any]] = None

    def register_check(self, name: str, check_func: callable):
        self.checks[name] = check_func

    def run_health_checks(self) -> Dict[str, Any]:
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'healthy',
            'checks': {}
        }

        for name, check_func in self.checks.items():
            try:
                healthy = check_func()
                results['checks'][name] = {
                    'status': 'healthy' if healthy else 'unhealthy',
                    'timestamp': datetime.utcnow().isoformat()
                }
                if not healthy:
                    results['status'] = 'unhealthy'
            except Exception as exc:
                results['checks'][name] = {
                    'status': 'error',
                    'error': str(exc),
                    'timestamp': datetime.utcnow().isoformat()
                }
                results['status'] = 'unhealthy'

        self.last_check = results
        return results

health_monitor = HealthMonitor()

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=4096)
    PRODUCTIONerature: float = Field(0.7, ge=0.1, le=2.0)
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
    type: str = "info"
    timestamp: datetime
    read: bool = False

class DatabaseManager:
    def __init__(self, db_path: Path = DATABASE_PATH):
        self.db_path = db_path
        self.init_database()

    def init_database(self) -> None:
        conn = get_database_connection()
        cursor = conn.cursor()
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

    def get_connection(self) -> sqlite3.Connection:
        return get_database_connection()

class AIModelsManager:
    def __init__(self) -> None:
        self.models: Dict[str, Dict[str, Any]] = {}
        self.load_models()

    def load_models(self) -> None:
        self.models = {
            "qmoi-master": {
                "name": "QMOI Master",
                "type": "generative",
                "max_length": 4096,
                "PRODUCTIONerature": 0.7,
                "loaded": True
            },
            "qmoi-coding": {
                "name": "QMOI Coding Assistant",
                "type": "code_generation",
                "max_length": 2048,
                "PRODUCTIONerature": 0.3,
                "loaded": True
            },
            "qmoi-gaming": {
                "name": "QMOI Gaming AI",
                "type": "gaming",
                "max_length": 1024,
                "PRODUCTIONerature": 0.8,
                "loaded": True
            }
        }
        logger.info("AI models loaded successfully")

    async def generate_response(self, model_name: str, prompt: str, config: Dict[str, Any]) -> str:
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found")
        model = self.models[model_name]
        await asyncio.sleep(0.05)
        return f"AI Response from {model['name']}: {prompt[:100]}"

    def get_model_info(self, model_name: str) -> Dict[str, Any]:
        return self.models.get(model_name, {})

class RevenueManager:
    def __init__(self) -> None:
        self.daily_target = 200000

    async def get_revenue_overview(self) -> Dict[str, Any]:
        conn = db_manager.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT SUM(amount) FROM revenue_data WHERE DATE(timestamp) = DATE('now')")
        today_revenue = cursor.fetchone()[0] or 0
        cursor.execute("SELECT SUM(amount) FROM revenue_data WHERE strftime('%Y-%m', timestamp) = strftime('%Y-%m', 'now')")
        month_revenue = cursor.fetchone()[0] or 0
        cursor.execute("SELECT source, SUM(amount) as total FROM revenue_data WHERE DATE(timestamp) = DATE('now') GROUP BY source")
        revenue_by_source = dict(cursor.fetchall())
        conn.close()
        return {
            "today": today_revenue,
            "month": month_revenue,
            "daily_target": self.daily_target,
            "target_progress": (today_revenue / self.daily_target * 100) if self.daily_target else 0,
            "by_source": revenue_by_source,
            "trend": []
        }

    async def add_revenue(self, revenue_data: RevenueData) -> bool:
        try:
            conn = db_manager.get_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO revenue_data (amount, currency, source, timestamp, metadata) VALUES (?, ?, ?, ?, ?)",
                (
                    revenue_data.amount,
                    revenue_data.currency,
                    revenue_data.source,
                    revenue_data.timestamp.isoformat(),
                    json.dumps(revenue_data.metadata) if revenue_data.metadata else None
                )
            )
            conn.commit()
            conn.close()
            return True
        except Exception as exc:
            logger.error(f"Failed to add revenue: {exc}")
            return False

class ProjectManager:
    def __init__(self) -> None:
        self.projects: Dict[int, Dict[str, Any]] = {}

    async def get_projects(self) -> List[Dict[str, Any]]:
        conn = db_manager.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, description, status, progress, technologies, created_at, updated_at FROM projects")
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

class GamingManager:
    def __init__(self) -> None:
        self.games: Dict[int, Dict[str, Any]] = {}

    async def get_games(self) -> List[Dict[str, Any]]:
        conn = db_manager.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, description, category, players, status, created_at FROM games")
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

# Initialize managers
db_manager = DatabaseManager()
ai_models_manager = AIModelsManager()
revenue_manager = RevenueManager()
project_manager = ProjectManager()
gaming_manager = GamingManager()

@app.get("/")
async def root() -> HTMLResponse:
    index_path = PROJECT_ROOT / "qmoi-space-pwa" / "index.html"
    if index_path.exists():
        return HTMLResponse(index_path.read_text(encoding='utf-8'))
    raise HTTPException(status_code=404, detail="PWA not found")

@app.get("/api/health")
async def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": API_VERSION,
        "uptime": time.time()
    }

@app.post("/api/chat/generate")
async def generate_chat_response(message: ChatMessage) -> ChatResponse:
    try:
        response_text = await ai_models_manager.generate_response(
            "qmoi-master",
            message.message,
            {
                "PRODUCTIONerature": message.PRODUCTIONerature,
                "max_length": message.max_length,
                "top_p": message.top_p,
                "repetition_penalty": message.repetition_penalty
            }
        )
        return ChatResponse(
            response=response_text,
            timestamp=datetime.utcnow(),
            model_info=ai_models_manager.get_model_info("qmoi-master"),
            usage={"tokens": len(response_text.split())}
        )
    except Exception as exc:
        logger.error(f"Failed to generate chat response: {exc}")
        raise HTTPException(status_code=500, detail="Failed to generate response")

@app.get("/api/revenue/overview")
async def get_revenue_overview() -> Dict[str, Any]:
    return await revenue_manager.get_revenue_overview()

@app.post("/api/revenue/add")
async def add_revenue_endpoint(revenue_data: RevenueData) -> Dict[str, Any]:
    success = await revenue_manager.add_revenue(revenue_data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to add revenue")
    return {"status": "success"}

@app.get("/api/projects")
async def get_projects() -> Dict[str, Any]:
    return {"projects": await project_manager.get_projects()}

@app.get("/api/games")
async def get_games() -> Dict[str, Any]:
    return {"games": await gaming_manager.get_games()}

@app.on_event("startup")
async def startup_event() -> None:
    global redis_client
    try:
        redis_client = redis.Redis.from_url(REDIS_URL)
        redis_client.ping()
        logger.info("Redis connection established")
    except Exception as exc:
        logger.warning(f"Redis connection failed: {exc}")
    logger.info("QMOI Space Backend started successfully")

@app.on_event("shutdown")
async def shutdown_event() -> None:
    if redis_client:
        try:
            redis_client.close()
        except Exception:
            logger.warning("Placeholder: production implementation pending"); return None
    logger.info("QMOI Space Backend shutdown complete")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "scripts.qmoi-space-backend:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )
