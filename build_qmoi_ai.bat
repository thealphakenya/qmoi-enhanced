@echo off
setlocal enabledelayedexpansion

REM === CONFIG ===
set "APP\_NAME=qmoi\_ai"
set "BUILD\_DIR=dist"
set "VENV\_DIR=venv"
set "PYTHON=%VENV\_DIR%\Scripts\python.exe"
set "PIP=%VENV\_DIR%\Scripts\pip.exe"
set "PYINSTALLER=%VENV\_DIR%\Scripts\pyinstaller.exe"
set "BUILD\_LOG=build\_logs\build\_%DATE:\~10,4%-%DATE:\~4,2%-%DATE:\~7,2%\_%TIME:\~0,2%-%TIME:\~3,2%.log"
set "ENTRY\_SCRIPT=qmoiexe.py"
set "ICON\_FILE=qmoi\_ai\_icon.ico"

REM === START ===
echo \[🔧] Initializing QMOI AI clean build... > "!BUILD\_LOG!"
mkdir build\_logs 2>nul

REM === Check entrypoint ===
if not exist "!ENTRY\_SCRIPT!" (
echo ❌ Entry script '!ENTRY\_SCRIPT!' not found. >> "!BUILD\_LOG!"
echo Exiting...
pause
exit /b
)

REM === Create virtual environment ===
if not exist "!VENV\_DIR!" (
echo \[📦] Creating virtual environment...
python -m venv "!VENV\_DIR!" >> "!BUILD\_LOG!" 2>&1
)

REM === Upgrade pip, setuptools, wheel ===
echo \[⬆️] Upgrading pip, setuptools, wheel...
"!PYTHON!" -m pip install --upgrade pip setuptools wheel >> "!BUILD\_LOG!" 2>&1

REM === Install PyInstaller ===
echo \[📦] Ensuring PyInstaller is installed...
"!PIP!" install pyinstaller >> "!BUILD\_LOG!" 2>&1

REM === Auto-fix missing modules (loop all imports) ===
echo \[🤖] Checking & installing missing modules...
for /f "tokens=1" %%m in ('findstr /r /c:"^import " /c:"^from " !ENTRY\_SCRIPT!') do (
echo Installing module: %%m >> "!BUILD\_LOG!"
"!PIP!" install %%m >> "!BUILD\_LOG!" 2>&1
)

REM === Clean previous builds ===
echo \[🧹] Cleaning old builds...
if exist build rmdir /s /q build >> "!BUILD\_LOG!" 2>&1
if exist dist rmdir /s /q dist >> "!BUILD\_LOG!" 2>&1
del /q \*.spec >> "!BUILD\_LOG!" 2>&1

REM === Check for pyinstaller.exe ===
if not exist "!PYINSTALLER!" (
echo ❌ PyInstaller not found: !PYINSTALLER! >> "!BUILD\_LOG!"
echo ❌ PyInstaller install failed.
pause
exit /b
)

REM === Build with PyInstaller.exe ===
echo \[⚙️] Building executable with pyinstaller.exe...
"!PYINSTALLER!" ^
\--noconfirm ^
\--onefile ^
\--windowed ^
\--name "!APP\_NAME!" ^
\--icon "!ICON\_FILE!" ^
\--add-data "app;app" ^
\--add-data "backend;backend" ^
"!ENTRY\_SCRIPT!" >> "!BUILD\_LOG!" 2>&1

REM === Final Check ===
if exist "!BUILD\_DIR!!APP\_NAME!.exe" (
echo \[✅] Build successful: !BUILD\_DIR!!APP\_NAME!.exe >> "!BUILD\_LOG!"
echo ✅ Build successful! Launching GitHub deploy...
call \:upload\_to\_github
) else (
echo ❌ Build failed. Check log: !BUILD\_LOG!
)

pause
exit /b

\:upload\_to\_github
echo \[🌍] Uploading to GitHub...
set "RELEASE\_TAG=v1.0.0"
gh release create !RELEASE\_TAG! ^
"!BUILD\_DIR!!APP\_NAME!.exe" ^
\--repo "thealphakenya/qmoi\_ai" ^
\--title "QMOI AI !RELEASE\_TAG!" ^
\--notes "Auto-built using clean venv & QCity automation." >> "!BUILD\_LOG!" 2>&1
echo ✅ Upload complete.
exit /b
