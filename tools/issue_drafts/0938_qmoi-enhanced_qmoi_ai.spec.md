---
title: "Issue draft for qmoi-enhanced/qmoi_ai.spec"
generated: 2025-11-08T16:06:38.804825Z
---

# Review needed: qmoi-enhanced/qmoi_ai.spec

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
# qmoi_ai.spec
# ✅ PyInstaller .spec for QMOI AI
# This bundles your app into a single .exe with frontend, backend, assets, and icons.

import os
from PyInstaller.utils.hooks import collect_submodules
from PyInstaller.building.build_main import Analysis, PYZ, EXE, COLLECT

project_name = "qmoi_ai"
entry_script = os.path.join("launcher", "qmoiexe.py")

# Automatically include all Python submodules used by the launcher or imported dynamically
hiddenimports = collect_submodules(project_name)

a = Analysis(
    [entry_script],
    pathex=[os.getcwd()],
    binaries=[],
    datas=[
        ("app", "app"),                 # ✅ Frontend UI (Next.js, React, or HTML/CSS)
        ("assets", "assets"),           # ✅ Application-specific assets
        ("static", "static"),           # ✅ Static files (e.g., images, fonts, etc.)
        ("launcher/q-icon.ico", "."),   # ✅ Windows .ico file for branding
    ],
    hiddenimports=hiddenimports,
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=None,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=None)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name=project_name,
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,                    # ❌ Hide terminal window
    icon="launcher/q-icon.ico",       # ✅ Set custom icon
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    name=project_name
)

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
