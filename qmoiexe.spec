# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['qmoiexe.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('public/icon.ico', 'public'),
        ('auto_qmoi_icon.ico', '.'),             # Include fallback icon if generated
        ('app/out/index.html', 'app/out'),       # Frontend entry
        ('app/out/static/**/*', 'app/out/static'),  # All static files (CSS/JS/fonts)
        ('media/**/*', 'media'),                 # Include media directory if used
    ],
    hiddenimports=[
        'pystray',
        'PIL.Image',
        'PIL.ImageDraw',
        'PIL.ImageFont',
        'win32com.client',
        'fastapi',
        'uvicorn',
        'customtkinter',
        'starlette.staticfiles',  # For FastAPI StaticFiles
        'starlette.responses',    # For FileResponse
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=1,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='qmoiexe',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,  # Set to True if you want to debug CLI logs
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='public/icon.ico',
)
