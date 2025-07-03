#!/bin/bash

LOGFILE="logs/qcity_npm_selfheal.log"
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

echo "=== Clean Up ===" | tee -a $LOGFILE
rm -rf node_modules package-lock.json | tee -a $LOGFILE
npm cache clean --force | tee -a $LOGFILE

echo "=== NPM Install (1st attempt) ===" | tee -a $LOGFILE
npm install 2>&1 | tee -a $LOGFILE
INSTALL_STATUS=${PIPESTATUS[0]}

if [ $INSTALL_STATUS -ne 0 ]; then
  echo "=== NPM Install failed, retrying with --legacy-peer-deps ===" | tee -a $LOGFILE
  npm install --legacy-peer-deps 2>&1 | tee -a $LOGFILE
  INSTALL_STATUS=${PIPESTATUS[0]}
fi

if [ $INSTALL_STATUS -ne 0 ]; then
  echo "=== NPM Install failed, retrying with --force ===" | tee -a $LOGFILE
  npm install --force 2>&1 | tee -a $LOGFILE
  INSTALL_STATUS=${PIPESTATUS[0]}
fi

if [ $INSTALL_STATUS -eq 0 ]; then
  echo "=== NPM Install succeeded ===" | tee -a $LOGFILE
else
  echo "=== NPM Install failed after all attempts ===" | tee -a $LOGFILE
fi

echo "=== NPM Audit ===" | tee -a $LOGFILE
npm audit 2>&1 | tee -a $LOGFILE
AUDIT_STATUS=${PIPESTATUS[0]}

if [ $AUDIT_STATUS -ne 0 ]; then
  echo "=== NPM Audit found issues or failed ===" | tee -a $LOGFILE
else
  echo "=== NPM Audit passed ===" | tee -a $LOGFILE
fi

echo "==== End of Run ====" | tee -a $LOGFILE
