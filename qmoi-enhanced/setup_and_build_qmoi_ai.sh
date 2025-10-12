
#!/bin/bash
set -e
APP_NAME="qmoi_ai"
ENTRY_SCRIPT="qmoiexe.py"
ICON_FILE="qmoi_ai_icon.ico"
BUILD_DIR="dist"
VENV_DIR="venv"
TIMESTAMP=$(date +"%Y-%m-%d_%H%M%S")
LOG_DIR="build_logs"
LOG_FILE="$LOG_DIR/build_${TIMESTAMP}.log"

mkdir -p "$LOG_DIR"
echo "[🔧] Starting QMOI AI build..." > "$LOG_FILE"

if [ ! -f "$ENTRY_SCRIPT" ]; then
  echo "❌ Entry script $ENTRY_SCRIPT not found!" | tee -a "$LOG_FILE"
  exit 1
fi

# Git pull
echo "[🌍] Pulling latest..." | tee -a "$LOG_FILE"
git pull origin main >> "$LOG_FILE" 2>&1

# Create venv
if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

# Upgrade tools
pip install --upgrade pip setuptools wheel >> "$LOG_FILE" 2>&1
pip install --force-reinstall pyinstaller >> "$LOG_FILE" 2>&1

# Clean
rm -rf build "$BUILD_DIR"
rm -f *.spec

# Build with retry
RETRIES=3
COUNT=0
SUCCESS=0
while [ $COUNT -lt $RETRIES ]; do
  echo "[⚙️] Building... (Attempt $((COUNT+1))/$RETRIES)" | tee -a "$LOG_FILE"
  if pyinstaller --noconfirm --onefile --windowed \
    --name "$APP_NAME" \
    --icon "$ICON_FILE" \
    --add-data "app:app" --add-data "backend:backend" \
    "$ENTRY_SCRIPT" >> "$LOG_FILE" 2>&1; then
    SUCCESS=1
    break
  else
    echo "[❌] Build failed. Retrying..." | tee -a "$LOG_FILE"
    sleep 2
    COUNT=$((COUNT+1))
  fi
done

# Release if successful
if [ $SUCCESS -eq 1 ] && [ -f "$BUILD_DIR/$APP_NAME" ]; then
  echo "[✅] Build successful: $BUILD_DIR/$APP_NAME" | tee -a "$LOG_FILE"
  gh release delete v1.0.0 --yes || true
  gh release create v1.0.0 "$BUILD_DIR/$APP_NAME" \
    --title "QMOI AI v1.0.0" \
    --notes "Auto-built using QCity automation." >> "$LOG_FILE" 2>&1
else
  echo "[❌] Build failed after $RETRIES attempts." | tee -a "$LOG_FILE"
  deactivate
  exit 1
fi

# Git auto push
git add *.py app/ backend/ *.md *.json *.yml *.ico
git commit -m "Auto: QMOI build update $TIMESTAMP" || echo "Nothing to commit"
git push origin main >> "$LOG_FILE" 2>&1

deactivate
