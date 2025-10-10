@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM QMOI System Startup Script
REM Windows startup script for the enhanced QMOI system

echo 🚀 Starting QMOI Enhanced System...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version
echo ✅ npm version: 
npm --version

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Run environment setup
echo 🔧 Running environment setup...
node scripts/qmoi-environment-setup.js
if %errorlevel% neq 0 (
    echo ❌ Environment setup failed
    pause
    exit /b 1
)

REM Enable master mode
echo 👑 Enabling master mode...
node scripts/qmoi-master-system.js --master-mode enable
if %errorlevel% neq 0 (
    echo ❌ Failed to enable master mode
    pause
    exit /b 1
)

REM Start enhanced auto projects system
echo 🎬 Starting enhanced auto projects system...
start /B node scripts/qmoi-enhanced-auto-projects.js
set AUTO_PROJECTS_PID=%errorlevel%

REM Start revenue dashboard system
echo 📊 Starting revenue dashboard system...
start /B node scripts/qmoi-revenue-dashboard.js
set DASHBOARD_PID=%errorlevel%

REM Start master system
echo 🎯 Starting master system...
start /B node scripts/qmoi-master-system.js
set MASTER_PID=%errorlevel%

REM Start notification system
echo 📢 Starting notification system...
start /B node scripts/qmoi-notification-system.js
set NOTIFICATION_PID=%errorlevel%

REM Start avatar system
echo 🎭 Starting avatar system...
start /B node scripts/qmoi-enhanced-avatar-system.js
set AVATAR_PID=%errorlevel%

REM Start music production system
echo 🎵 Starting music production system...
start /B node scripts/qmoi-music-production-system.js
set MUSIC_PID=%errorlevel%

REM Start auto-fix system
echo 🔧 Starting auto-fix system...
start /B node scripts/qmoi-enhanced-auto-fix.js
set AUTOFIX_PID=%errorlevel%

REM Start GitHub integration
echo 🐙 Starting GitHub integration...
start /B node scripts/qmoi-github-integration.js
set GITHUB_PID=%errorlevel%

REM Start vulnerability scanner
echo 🔒 Starting vulnerability scanner...
start /B node scripts/qmoi-vulnerability-scanner.js
set VULN_PID=%errorlevel%

echo ✅ QMOI Enhanced System started successfully!
echo 📊 Systems running:
echo   - Enhanced Auto Projects
echo   - Revenue Dashboard
echo   - Master System
echo   - Notification System
echo   - Avatar System
echo   - Music Production
echo   - Auto-Fix System
echo   - GitHub Integration
echo   - Vulnerability Scanner

echo.
echo 🎯 Daily Revenue Target: 100,000 KES (unlimited maximum)
echo 📈 Revenue Streams: 15+ automated streams
echo 🎬 Project Types: Animation, Apps, Content, Services
echo 🌐 Platforms: 20+ distribution platforms
echo 🔒 Master Mode: Enabled
echo 📊 Dashboard: Available at /qcity/revenue-dashboard

echo.
echo 💡 Commands:
echo   - Test system: node scripts/test-qmoi-system.js
echo   - View logs: type logs\qmoi-*.log
echo   - Stop system: stop-qmoi.bat
echo   - Restart system: restart-qmoi.bat

echo.
echo 🔄 QMOI system is running. Press any key to stop.
pause >nul

echo 🛑 Stopping QMOI system...
call stop-qmoi.bat

echo ✅ QMOI system stopped.
pause 