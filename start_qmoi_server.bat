@echo off
cd /d %~dp0

echo [🔁] Killing processes on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| find ":8080" ^| find "LISTENING"') do taskkill /PID %%a /F >nul 2>&1

echo [🚀] Starting Ngrok tunnel + FastAPI...
start cmd /k python start_qmoi_ngrok.py

timeout /t 5 /nobreak >nul

echo [🌐] Opening browser to Ngrok tunnel if EXE is available...
start "" ngrok_tunnel.txt

exit
