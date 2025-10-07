from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
import torch
import numpy as np
from .deploy import QMOIServer
import logging
import json
from pathlib import Path

# Initialize FastAPI app
app = FastAPI(
    title="QMOI Model Server",
    description="API for serving QMOI model predictions",
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

# Initialize logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='logs/server.log'
)
logger = logging.getLogger(__name__)

# Load configuration
config_path = 'config/qmoi_config.json'
with open(config_path, 'r') as f:
    config = json.load(f)

# Initialize model server
model_server = QMOIServer(
    model_path='deployed_model/model.onnx',
    config_path='deployed_model/config.json'
)

# Define request models
class PredictionRequest(BaseModel):
    input_ids: List[int]
    attention_mask: Optional[List[int]] = None
    task: Optional[str] = "classification"

class BatchPredictionRequest(BaseModel):
    inputs: List[PredictionRequest]

# Define response models
class PredictionResponse(BaseModel):
    predictions: List[float]
    probabilities: Optional[List[float]] = None
    task: str

class BatchPredictionResponse(BaseModel):
    predictions: List[PredictionResponse]

class HealthResponse(BaseModel):
    status: str
    model_info: Dict[str, Any]

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check the health of the model server."""
    try:
        # Get model information
        model_info = {
            "model_path": str(Path('deployed_model/model.onnx').absolute()),
            "config_path": str(Path('deployed_model/config.json').absolute()),
            "max_length": config['max_length'],
            "num_labels": config['num_labels'],
            "vocab_size": config['vocab_size']
        }
        
        return HealthResponse(
            status="healthy",
            model_info=model_info
        )
    
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Single prediction endpoint
@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Get predictions for a single input."""
    try:
        # Convert input to tensor
        input_ids = torch.tensor([request.input_ids])
        attention_mask = torch.tensor([request.attention_mask]) if request.attention_mask else None
        
        # Prepare inputs
        inputs = {
            'input_ids': input_ids,
            'attention_mask': attention_mask
        }
        
        # Get predictions
        outputs = model_server.predict(inputs)
        
        # Process outputs
        predictions = outputs['predictions']
        probabilities = outputs.get('probabilities')
        
        return PredictionResponse(
            predictions=predictions,
            probabilities=probabilities,
            task=request.task
        )
    
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Batch prediction endpoint
@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(request: BatchPredictionRequest):
    """Get predictions for a batch of inputs."""
    try:
        # Process each input
        predictions = []
        for input_request in request.inputs:
            # Convert input to tensor
            input_ids = torch.tensor([input_request.input_ids])
            attention_mask = torch.tensor([input_request.attention_mask]) if input_request.attention_mask else None
            
            # Prepare inputs
            inputs = {
                'input_ids': input_ids,
                'attention_mask': attention_mask
            }
            
            # Get predictions
            outputs = model_server.predict(inputs)
            
            # Process outputs
            predictions.append(
                PredictionResponse(
                    predictions=outputs['predictions'],
                    probabilities=outputs.get('probabilities'),
                    task=input_request.task
                )
            )
        
        return BatchPredictionResponse(predictions=predictions)
    
    except Exception as e:
        logger.error(f"Batch prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Model information endpoint
@app.get("/model/info")
async def model_info():
    """Get information about the deployed model."""
    try:
        return {
            "model_config": config,
            "deployment_config": config['deployment'],
            "optimization_config": config['deployment']['optimization'],
            "security_config": config['security']
        }
    
    except Exception as e:
        logger.error(f"Failed to get model info: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def start_server():
    """Start the FastAPI server."""
    uvicorn.run(
        app,
        host=config['deployment'].get('host', '0.0.0.0'),
        port=config['deployment'].get('port', 8000),
        workers=config['deployment'].get('workers', 1)
    )

if __name__ == "__main__":
    start_server() 