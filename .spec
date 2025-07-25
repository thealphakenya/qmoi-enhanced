# ✅ PyInstaller .spec for QMOI AI
# This bundles your app into a single .exe with assets

# Assumes entry script is at: launcher/qmoiexe.py
# Will bundle frontend, backend, assets, icons

import os
from PyInstaller.utils.hooks import collect_submodules

project_name = "qmoi_ai"
entry_script = os.path.join("launcher", "qmoiexe.py")

# Automatically collect all submodules
hiddenimports = collect_submodules(project_name)

a = Analysis(
    [entry_script],
    pathex=[os.getcwd()],
    binaries=[],
    datas=[
        ("app", "app"),  # frontend directory
        ("assets", "assets"),
        ("static", "static"),
        ("launcher/q-icon.ico", ".")  # Windows icon
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
    console=False,
    icon="launcher/q-icon.ico",
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
