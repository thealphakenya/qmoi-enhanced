#!/usr/bin/env bash
cd /workspaces/qmoi-enhanced || exit 1
exec /usr/bin/env python3 scripts/qmoi_md_autoupdater.py
