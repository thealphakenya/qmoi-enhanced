#!/bin/bash

LOGFILE="logs/qcity_npm_selfheal.log"
FORCE_CLEAN=0
ESSENTIALS_ONLY=0
UPGRADE_ALL=0
DIAGNOSTICS_ONLY=0

# Option parsing
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --force-clean) FORCE_CLEAN=1 ; shift ;;
    --essentials-only) ESSENTIALS_ONLY=1 ; shift ;;
    --upgrade-all) UPGRADE_ALL=1 ; shift ;;
    --diagnostics-only) DIAGNOSTICS_ONLY=1 ; shift ;;
    *) shift ;;
  esac
done

echo "==== QCity NPM Self-Heal Run: $(date) ====" | tee -a $LOGFILE

echo "=== Disk Usage ===" | tee -a $LOGFILE
df -h . | tee -a $LOGFILE

echo "=== Directory Permissions ===" | tee -a $LOGFILE
ls -ld . | tee -a $LOGFILE

echo "=== Node Version ===" | tee -a $LOGFILE
node -v | tee -a $LOGFILE

echo "=== NPM Version ===" | tee -a $LOGFILE
npm -v | tee -a $LOGFILE

echo "=== Network Test ===" | tee -a $LOGFILE
ping -c 2 registry.npmjs.org || echo "Ping failed" | tee -a $LOGFILE

if [ $FORCE_CLEAN -eq 1 ]; then
  echo "=== Force Clean Enabled ===" | tee -a $LOGFILE
  rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml | tee -a $LOGFILE
  npm cache clean --force | tee -a $LOGFILE
fi

# Essentials list
ESSENTIALS=(npm yarn pnpm node-gyp typescript eslint prettier nodemon pm2 npm-check-updates ts-node rimraf cross-env dotenv-cli serve http-server concurrently jest mocha nyc tsc webpack vite)

ensure_global() {
  PKG=$1
  echo "Ensuring $PKG is installed/upgraded..." | tee -a $LOGFILE
  npm install -g $PKG 2>&1 | tee -a $LOGFILE
}

if [ $ESSENTIALS_ONLY -eq 1 ]; then
  for pkg in "${ESSENTIALS[@]}"; do
    ensure_global $pkg
done
  echo "=== Essentials Only Mode Complete ===" | tee -a $LOGFILE
  exit 0
fi

for pkg in "${ESSENTIALS[@]}"; do
  ensure_global $pkg
done

if [ $DIAGNOSTICS_ONLY -eq 1 ]; then
  echo "=== Diagnostics Only Mode Complete ===" | tee -a $LOGFILE
  exit 0
fi

install_cmds=(
  "npm ci"
  "npm install"
  "npm install --legacy-peer-deps"
  "npm install --force"
  "yarn install"
  "pnpm install"
)

success=0
retries=0
max_retries=3
for cmd in "${install_cmds[@]}"; do
  while [ $retries -lt $max_retries ]; do
    echo "Running: $cmd (Attempt $((retries+1)))" | tee -a $LOGFILE
    eval $cmd 2>&1 | tee -a $LOGFILE
    if [ $? -eq 0 ]; then
      success=1
      break 2
    else
      echo "Install failed: $cmd. Cleaning up and retrying..." | tee -a $LOGFILE
      rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml
      npm cache clean --force 2>&1 | tee -a $LOGFILE
      sleep $((5 * (retries+1)))
      retries=$((retries+1))
    fi
  done
  retries=0

done
if [ $success -eq 1 ]; then
  echo "=== Dependency install succeeded ===" | tee -a $LOGFILE
else
  echo "=== All install strategies failed ===" | tee -a $LOGFILE
fi

# Atomic/temp install
TEMP_DIR="node_modules_temp"
if [ -d "$TEMP_DIR" ]; then rm -rf "$TEMP_DIR"; fi
mkdir "$TEMP_DIR"
if [ $ESSENTIALS_ONLY -eq 0 ] && [ $DIAGNOSTICS_ONLY -eq 0 ]; then
  echo "=== Atomic Install to $TEMP_DIR ===" | tee -a $LOGFILE
  npm install --prefix "$TEMP_DIR" 2>&1 | tee -a $LOGFILE
  if [ -d node_modules ]; then rm -rf node_modules; fi
  mv "$TEMP_DIR/node_modules" node_modules
  rm -rf "$TEMP_DIR"
fi

# Cloud offload (stub)
if [ "$CLOUD_OFFLOAD" = "1" ]; then
  echo "=== Offloading install/build to QCity cloud ===" | tee -a $LOGFILE
  # TODO: Implement real cloud API call
fi

# Health monitor
npm outdated 2>&1 | tee -a $LOGFILE
npm audit 2>&1 | tee -a $LOGFILE
npm prune 2>&1 | tee -a $LOGFILE

echo "=== NPM Audit ===" | tee -a $LOGFILE
npm audit 2>&1 | tee -a $LOGFILE
AUDIT_STATUS=${PIPESTATUS[0]}

if [ $AUDIT_STATUS -ne 0 ]; then
  echo "=== NPM Audit found issues or failed ===" | tee -a $LOGFILE
else
  echo "=== NPM Audit passed ===" | tee -a $LOGFILE
fi

# Notification hooks (API/email) - customize as needed
SEND_API_NOTIFICATION=0
SEND_EMAIL_NOTIFICATION=0
if [ $SEND_API_NOTIFICATION -eq 1 ]; then
  curl -X POST -H "Content-Type: application/json" -d '{"type":"system","priority":"high","message":"NPM Self-Heal completed."}' http://localhost:3000/api/qcity/notifications
fi
if [ $SEND_EMAIL_NOTIFICATION -eq 1 ]; then
  echo "NPM Self-Heal completed. See attached log." | mail -s "[QCity] NPM Self-Heal Run" -A $LOGFILE admin@yourdomain.com
fi

echo "==== End of Run ====" | tee -a $LOGFILE
