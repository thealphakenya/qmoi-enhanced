#!/bin/bash
set -e
LOG_FILE="build_qmoi_$(date +"%Y-%m-%d_%H%M%S").log"
echo "[🚀] Launching QMOI AI Builder..." | tee "$LOG_FILE"

RETRIES=3
COUNT=0
SUCCESS=0
while [ $COUNT -lt $RETRIES ]; do
	if python3 qmoi-app-builder.py 2>&1 | tee -a "$LOG_FILE"; then
		SUCCESS=1
		break
	else
		echo "[❌] Build failed. Retrying $((COUNT+1))/$RETRIES..." | tee -a "$LOG_FILE"
		sleep 2
		COUNT=$((COUNT+1))
	fi
done

if [ $SUCCESS -eq 1 ]; then
	echo "[✅] Build completed successfully." | tee -a "$LOG_FILE"
else
	echo "[❌] Build failed after $RETRIES attempts. Check $LOG_FILE for details." | tee -a "$LOG_FILE"
	exit 1
fi

read -p "[Press Enter to exit]"
