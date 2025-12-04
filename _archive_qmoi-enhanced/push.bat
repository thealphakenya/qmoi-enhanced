@echo off
echo ========================================
echo Ultra-Automated Git Push
echo ========================================
echo.
echo This script will automatically handle ALL git operations
echo including conflicts, locks, and errors - NO human intervention needed!
echo.
echo Starting in 2 seconds...
timeout /t 2 /nobreak >nul

echo.
echo Executing automated push script...
powershell -ExecutionPolicy Bypass -File "auto-push.ps1"

echo.
echo Script execution completed.
pause
