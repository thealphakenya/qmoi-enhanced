from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import logging
from pathlib import Path
import sys
import os

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent.parent))

try:
    from scripts.ai_automation import AIAutomation, AutomationTask, SystemState
except Exception:
    # Provide a lightweight development stub if heavy ML dependencies aren't available
    class AutomationTask(BaseModel):
        id: str
        type: str
        status: str
        priority: int
        created_at: str
        updated_at: str
        parameters: Optional[Dict[str, Any]] = None

    class SystemState(BaseModel):
        resources: Dict[str, float] = {}
        performance: Dict[str, float] = {}
        errors: List[Dict[str, Any]] = []
        timestamp: str

    class AIAutomation:
        def __init__(self):
            self.running = False
            self.tasks: List[AutomationTask] = []
            self.system_state_history: List[SystemState] = []
            self.config = {}

        def start(self):
            self.running = True

        def stop(self):
            self.running = False

        def _collect_system_state(self):
            return SystemState(resources={}, performance={}, errors=[], timestamp=datetime.now().isoformat())

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Automation API",
    description="API endpoints for the AI-powered automation system",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Automation
automation = AIAutomation()

# Security
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class AutomationConfig(BaseModel):
    automation_interval: int = Field(..., ge=1)
    thresholds: Dict[str, float]
    max_concurrent_tasks: int = Field(..., ge=1)
    task_timeout: int = Field(..., ge=1)

class OptimizationRequest(BaseModel):
    target: str
    parameters: Dict[str, Any]

class TaskResponse(BaseModel):
    id: str
    type: str
    status: str
    result: Optional[Dict[str, Any]] = None

class SystemMetrics(BaseModel):
    resources: Dict[str, float]
    performance: Dict[str, float]
    errors: List[Dict[str, Any]]
    timestamp: str

# Security functions
def get_user(username: str):
    # Implement user retrieval from database (demo fallback when demo mode enabled)
    if os.getenv('QMOI_DEMO_MODE', 'false').lower() in ('1', 'true', 'yes'):
        return UserInDB(username=username, email=f"{username}@example.local", full_name=username, disabled=False, hashed_password='demo')
    # TODO: implement actual DB lookup
    return None

def authenticate_user(username: str, password: str):
    # Implement user authentication: in demo mode accept any username/password
    if os.getenv('QMOI_DEMO_MODE', 'false').lower() in ('1', 'true', 'yes'):
        return User(username=username, email=f"{username}@example.local", full_name=username, disabled=False)
    # TODO: Add proper password verification against DB
    return None

def create_access_token(data: dict):
    # Implement token creation - in demo mode return an opaque demo token
    if os.getenv('QMOI_DEMO_MODE', 'false').lower() in ('1', 'true', 'yes'):
        return 'demo-access-token'
    # TODO: create real JWT using secret
    return 'demo-fallback-token'

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Implement current user retrieval; in demo mode return a demo user from token
    if os.getenv('QMOI_DEMO_MODE', 'false').lower() in ('1', 'true', 'yes'):
        return User(username='demo', email='demo@example.local', full_name='Demo User', disabled=False)
    # TODO: Verify token with JWT and fetch the user
    raise HTTPException(status_code=401, detail='Unauthenticated')

# API Endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/automation/status")
async def get_automation_status(current_user: User = Depends(get_current_user)):
    """Get current automation system status"""
    try:
        return {
            "running": automation.running,
            "active_tasks": len(automation.tasks),
            "system_state": automation._collect_system_state().__dict__
        }
    except Exception as e:
        logger.error(f"Error getting automation status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/automation/start")
async def start_automation(current_user: User = Depends(get_current_user)):
    """Start the automation system"""
    try:
        automation.start()
        return {"status": "started", "message": "Automation system started successfully"}
    except Exception as e:
        logger.error(f"Error starting automation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/automation/stop")
async def stop_automation(current_user: User = Depends(get_current_user)):
    """Stop the automation system"""
    try:
        automation.stop()
        return {"status": "stopped", "message": "Automation system stopped successfully"}
    except Exception as e:
        logger.error(f"Error stopping automation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/automation/tasks")
async def get_tasks(current_user: User = Depends(get_current_user)):
    """Get all automation tasks"""
    try:
        return [task.__dict__ for task in automation.tasks]
    except Exception as e:
        logger.error(f"Error getting tasks: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/automation/tasks")
async def create_task(
    task: AutomationTask,
    current_user: User = Depends(get_current_user)
):
    """Create a new automation task"""
    try:
        automation.tasks.append(task)
        return {"status": "created", "task_id": task.id}
    except Exception as e:
        logger.error(f"Error creating task: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/automation/metrics")
async def get_metrics(current_user: User = Depends(get_current_user)):
    """Get system metrics"""
    try:
        state = automation._collect_system_state()
        return SystemMetrics(
            resources=state.resources,
            performance=state.performance,
            errors=state.errors,
            timestamp=state.timestamp
        )
    except Exception as e:
        logger.error(f"Error getting metrics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/automation/optimize")
async def optimize_system(
    request: OptimizationRequest,
    current_user: User = Depends(get_current_user)
):
    """Trigger system optimization"""
    try:
        task = AutomationTask(
            id=f"optimize-{int(datetime.now().timestamp())}",
            type="optimization",
            priority=1,
            status="pending",
            parameters=request.parameters,
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat()
        )
        automation.tasks.append(task)
        return {"status": "optimization_scheduled", "task_id": task.id}
    except Exception as e:
        logger.error(f"Error scheduling optimization: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/automation/history")
async def get_history(current_user: User = Depends(get_current_user)):
    """Get system state history"""
    try:
        return [state.__dict__ for state in automation.system_state_history]
    except Exception as e:
        logger.error(f"Error getting history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/automation/trends")
async def get_trends(current_user: User = Depends(get_current_user)):
    """Get system performance trends"""
    try:
        return {
            "resources": automation._analyze_resource_trends(automation.system_state_history[-10:]),
            "performance": automation._analyze_performance_trends(automation.system_state_history[-10:]),
            "errors": automation._analyze_error_trends(automation.system_state_history[-10:])
        }
    except Exception as e:
        logger.error(f"Error getting trends: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/automation/config")
async def update_config(
    config: AutomationConfig,
    current_user: User = Depends(get_current_user)
):
    """Update automation configuration"""
    try:
        automation.config.update(config.dict())
        return {"status": "updated", "message": "Configuration updated successfully"}
    except Exception as e:
        logger.error(f"Error updating config: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/automation/config")
async def get_config(current_user: User = Depends(get_current_user)):
    """Get current automation configuration"""
    try:
        return automation.config
    except Exception as e:
        logger.error(f"Error getting config: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 