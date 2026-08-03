#!/bin/bash
# QMOI Cloud Upload Automation Script
# Uploads backup archive to multiple cloud endpoints for redundancy

BACKUP=$(ls -t /tmp/qmoi-workspace-backup-*.tar.gz | head -1)

# Try transfer.sh
curl --max-time 120 -T "$BACKUP" https://transfer.sh/$(basename "$BACKUP") > /tmp/qmoi-cloud-upload-link.txt 2>/tmp/qmoi-cloud-upload-error.log
if grep -q 'https://' /tmp/qmoi-cloud-upload-link.txt; then
  echo "Backup uploaded to transfer.sh: $(cat /tmp/qmoi-cloud-upload-link.txt)"
else
  echo "transfer.sh upload failed. Trying next provider..."
  # Try file.io
  curl --max-time 120 -F "file=@$BACKUP" https://file.io > /tmp/qmoi-cloud-upload-link.txt 2>>/tmp/qmoi-cloud-upload-error.log
  if grep -q '"link":' /tmp/qmoi-cloud-upload-link.txt; then
    echo "Backup uploaded to file.io: $(grep '"link":' /tmp/qmoi-cloud-upload-link.txt)"
  else
    echo "All cloud uploads failed. See /tmp/qmoi-cloud-upload-error.log."
  fi
fi
