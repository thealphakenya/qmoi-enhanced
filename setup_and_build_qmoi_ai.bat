@echo off
setlocal enabledelayedexpansion

REM === CONFIG ===
set "APP\_NAME=qmoi\_ai"
set "BUILD\_DIR=dist"
set "VENV\_DIR=venv"
set "PYTHON=%VENV\_DIR%\Scripts\python.exe"
set "PIP=%VENV\_DIR%\Scripts\pip.exe"
set "PYINSTALLER=%VENV\_DIR%\Scripts\pyinstaller.exe"

REM === Get safe timestamp ===
for /f %%t in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd\_HHmmss"') do set "TIMESTAMP=%%t"
set "BUILD\_LOG=build\_logs\build\_!TIMESTAMP!.log"
set "ENTRY\_SCRIPT=qmoiexe.py"
set "ICON\_FILE=qmoi\_ai\_icon.ico"

REM === START ===
echo \[🔧] Initializing QMOI AI clean build... > "!BUILD\_LOG!"
mkdir build\_logs 2>nul

REM === Ensure Git repo is up to date ===
echo \[🌐] Pulling latest code... >> "!BUILD\_LOG!"
git pull origin main >> "!BUILD\_LOG!" 2>&1

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

REM === Show Python and Pip Info ===
echo \[ℹ️] Using Python: !PYTHON! >> "!BUILD\_LOG!"
echo \[ℹ️] Using Pip: !PIP! >> "!BUILD\_LOG!"
"!PYTHON!" -m pip --version >> "!BUILD\_LOG!" 2>&1
"!PYTHON!" -m pip list >> "!BUILD\_LOG!" 2>&1

REM === Upgrade pip, setuptools, wheel ===
echo \[⬆️] Upgrading pip, setuptools, wheel...
"!PYTHON!" -m pip install --upgrade pip setuptools wheel >> "!BUILD\_LOG!" 2>&1

REM === Install PyInstaller with retry logic ===
echo \[📦] Ensuring PyInstaller is installed...
"!PIP!" install --force-reinstall pyinstaller >> "!BUILD\_LOG!" 2>&1

REM === Confirm PyInstaller is importable ===
echo \[🔍] Verifying PyInstaller import...
"!PYTHON!" -c "import PyInstaller" >> "!BUILD\_LOG!" 2>&1 || (
echo ❌ PyInstaller import failed. Retrying install... >> "!BUILD\_LOG!"
"!PYTHON!" -m ensurepip >> "!BUILD\_LOG!" 2>&1
"!PYTHON!" -m pip install --upgrade pip setuptools wheel pyinstaller >> "!BUILD\_LOG!" 2>&1
)

REM === Auto-fix missing external modules ===
echo \[🤖] Checking & installing missing modules...
for /f "tokens=2 delims= " %%m in ('findstr /r /c:"^import " /c:"^from " !ENTRY\_SCRIPT!') do (
echo Installing module: %%m >> "!BUILD\_LOG!"
echo %%m | findstr /r /i "^os\$ ^sys\$ ^time\$ ^datetime\$ ^re\$ ^json\$ ^subprocess\$ ^threading\$" >nul || (
"!PIP!" install %%m >> "!BUILD\_LOG!" 2>&1
)
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

REM === Build with PyInstaller ===
echo \[⚙️] Building executable with pyinstaller.exe...
"!PYINSTALLER!" --noconfirm --onefile --windowed --name "!APP\_NAME!" --icon "!ICON\_FILE!" --add-data "app;app" --add-data "backend;backend" "!ENTRY\_SCRIPT!" >> "!BUILD\_LOG!" 2>&1

REM === Final Check ===
if exist "!BUILD\_DIR!!APP\_NAME!.exe" (
echo \[✅] Build successful: !BUILD\_DIR!!APP\_NAME!.exe >> "!BUILD\_LOG!"
echo ✅ Build successful! Launching GitHub deploy...
call \:upload\_to\_github
) else (
echo ❌ Build failed. Check log: !BUILD\_LOG!
)

REM === Optional: Backup logs and .spec ===
xcopy /Y \*.spec build\_logs\ 1>nul 2>&1

REM === Git automation (safe additions only) ===
echo \[🔁] Committing and pushing source changes only... >> "!BUILD\_LOG!"
git config user.email "[actions@qmoisystem.com](mailto:actions@qmoisystem.com)" >> "!BUILD\_LOG!" 2>&1
git config user.name "QMOI AutoBuilder" >> "!BUILD\_LOG!" 2>&1
git add \*.py app\ backend\ \*.md \*.yml \*.json \*.ico >> "!BUILD\_LOG!" 2>&1
git commit -m "Auto: Updated QMOI build + safe changes \[!TIMESTAMP!]" >> "!BUILD\_LOG!" 2>&1 || echo Nothing to commit. >> "!BUILD\_LOG!"
git push origin main >> "!BUILD\_LOG!" 2>&1

echo \[🚀] Repo updated.

REM === QCity Multi-platform App Sync ===
echo \[🌍] Syncing QMOI Apps to all release targets...
if exist Qmoi\_apps (
python scripts/qmoi-app-releaser.py all >> "!BUILD\_LOG!" 2>&1 || echo Releaser fallback failed. >> "!BUILD\_LOG!"
echo \[📦] Apps released across all platforms. >> "!BUILD\_LOG!"
)

pause
exit /b

\:upload\_to\_github
echo \[🌍] Uploading to GitHub...
set "RELEASE\_TAG=v1.0.0"
if exist "!BUILD\_DIR!!APP\_NAME!.exe" (
gh release delete !RELEASE\_TAG! --repo "thealphakenya/qmoi\_ai" -y >> "!BUILD\_LOG!" 2>&1
gh release create !RELEASE\_TAG! ^
"!BUILD\_DIR!!APP\_NAME!.exe" ^
\--repo "thealphakenya/qmoi\_ai" ^
\--title "QMOI AI !RELEASE\_TAG!" ^
\--notes "Auto-built using clean venv & QCity automation." >> "!BUILD\_LOG!" 2>&1
echo ✅ Upload complete.
)
exit /b
