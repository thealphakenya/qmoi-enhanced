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
