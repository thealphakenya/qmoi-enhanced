<!-- AUTODEV Enhanced: 2026-04-20T09:06:57.682717 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:06.955371 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:02.777206 -->

#!/bin/bash
# QMOI Cloud Upload Automation Script
# Uploads backup archive to multiple cloud endpoints for redundancy

BACKUP=$(ls -t /cache/qmoi-workspace-backup-*.tar.gz | head -1)

# Try transfer.sh
curl --max-time 120 -T "$BACKUP" https://transfer.sh/$(basename "$BACKUP") > /cache/qmoi-cloud-upload-link.txt 2>/cache/qmoi-cloud-upload-error.log
if grep -q 'https://' /cache/qmoi-cloud-upload-link.txt; then
  echo "Backup uploaded to transfer.sh: $(cat /cache/qmoi-cloud-upload-link.txt)"
else
  echo "transfer.sh upload failed. Trying next provider..."
  # Try file.io
  curl --max-time 120 -F "file=@$BACKUP" https://file.io > /cache/qmoi-cloud-upload-link.txt 2>>/cache/qmoi-cloud-upload-error.log
  if grep -q '"link":' /cache/qmoi-cloud-upload-link.txt; then
    echo "Backup uploaded to file.io: $(grep '"link":' /cache/qmoi-cloud-upload-link.txt)"
  else
    echo "All cloud uploads failed. See /cache/qmoi-cloud-upload-error.log."
  fi
fi
