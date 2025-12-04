# ✅ PyInstaller .spec file for Windows build
# File: qmoi_ai.spec

block_cipher = None

import os
from PyInstaller.utils.hooks import collect_submodules

hiddenimports = collect_submodules('your_qmoi_modules')

app_name = "qmoi_ai"

# Change to your entry point if different
entry_script = os.path.join('scripts', 'qmoiexe.py')


a = Analysis([
    entry_script
],
    pathex=[],
    binaries=[],
    datas=[('app/**', 'app'), ('static/**', 'static')],
    hiddenimports=hiddenimports,
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name=app_name,
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    icon='assets/icons/q.ico'
)
