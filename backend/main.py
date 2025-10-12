# QMOI AI FastAPI dashboard
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import psutil

app = FastAPI()

@app.get("/")
def root():
	return {"service": "QMOI AI", "status": "ready"}

@app.get("/status")
def status():
	# Placeholder: return more detailed status if available
	return JSONResponse(content={"status": "ready", "details": "QMOI AI backend running"})

@app.get("/resources")
def resources():
	# Return resource info
	return JSONResponse(content={
		"cpu": psutil.cpu_percent(),
		"memory": psutil.virtual_memory().percent,
		"disk": psutil.disk_usage('/').percent
	})
