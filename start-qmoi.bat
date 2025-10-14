@echo off
REM QMOI System Startup Script for Windows

echo 🚀 Starting QMOI Enhanced System...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Create necessary directories
mkdir logs 2>nul
mkdir config 2>nul
mkdir data 2>nul
mkdir avatars 2>nul
mkdir music 2>nul
mkdir reports 2>nul
mkdir backups 2>nul
mkdir temp 2>nul
mkdir uploads 2>nul
mkdir downloads 2>nul
mkdir cache 2>nul
mkdir models 2>nul
mkdir datasets 2>nul
mkdir artifacts 2>nul

REM Start the QMOI Master System
echo 🎯 Starting QMOI Master System...
node scripts/qmoi-master-system.js %*
pause
