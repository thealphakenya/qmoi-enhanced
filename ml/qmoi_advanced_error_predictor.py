import os
import json
from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List, Dict, Any
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import numpy as np

app = FastAPI()

DATA_PATH = os.getenv('QMOI_ERROR_FIX_LOG', '../logs/error_fix_summary.json')

class PredictionRequest(BaseModel):
    error_type: str
    file: str
    context: Dict[str, Any] = {}

class PredictionResponse(BaseModel):
    predicted_fix: str
    confidence: float
    details: Dict[str, Any]

# Simple feature extraction for demo
ERROR_TYPE_MAP = {}
FILE_MAP = {}

def load_data():
    if not os.path.exists(DATA_PATH):
        return [], []
    with open(DATA_PATH, 'r') as f:
        log = json.load(f)
    X, y = [], []
    for entry in log[-200:]:  # last 200 entries
        et = entry.get('errorType', 'unknown')
        fpath = entry.get('file', 'unknown')
        fix = entry.get('fixStatus', 'unknown')
        # Map categorical to int
        if et not in ERROR_TYPE_MAP:
            ERROR_TYPE_MAP[et] = len(ERROR_TYPE_MAP)
        if fpath not in FILE_MAP:
            FILE_MAP[fpath] = len(FILE_MAP)
        X.append([ERROR_TYPE_MAP[et], FILE_MAP[fpath]])
        y.append(1 if fix == 'fixed' else 0)
    return np.array(X), np.array(y)

model = None

@app.on_event('startup')
def train_model():
    global model
    X, y = load_data()
    if len(X) < 10:
        model = None
        return
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    model = RandomForestClassifier(n_estimators=50)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    print('ML Model Trained:', classification_report(y_test, y_pred))

@app.post('/predict', response_model=PredictionResponse)
def predict_fix(req: PredictionRequest):
    if model is None:
        return PredictionResponse(predicted_fix='unknown', confidence=0.0, details={'reason': 'Not enough data'})
    et_idx = ERROR_TYPE_MAP.get(req.error_type, 0)
    file_idx = FILE_MAP.get(req.file, 0)
    X = np.array([[et_idx, file_idx]])
    proba = model.predict_proba(X)[0][1]
    pred = 'fixed' if proba > 0.5 else 'unfixed'
    return PredictionResponse(predicted_fix=pred, confidence=float(proba), details={})

@app.get('/health')
def health():
    return {'status': 'ok', 'model': 'trained' if model else 'not_ready'}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=4300) 