; qmoi_ai_installer.iss — Inno Setup Script for Windows Installer
; ✅ Builds a full-featured .exe installer for QMOI AI
; 📍 Requires: Inno Setup (https://jrsoftware.org/isinfo.php)

[Setup]
AppName=QMOI AI
AppVersion=1.0.0
DefaultDirName={pf}\QMOI AI
DefaultGroupName=QMOI AI
OutputBaseFilename=qmoi_ai_installer
OutputDir=dist
Compression=lzma
SolidCompression=yes
DisableDirPage=no
ArchitecturesInstallIn64BitMode=x64
SetupIconFile=launcher\q-icon.ico
UninstallDisplayIcon={app}\qmoi_ai.exe

[Files]
Source: "dist\qmoi_ai\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\QMOI AI"; Filename: "{app}\qmoi_ai.exe"
Name: "{commondesktop}\QMOI AI"; Filename: "{app}\qmoi_ai.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional icons:"
Name: "autorun"; Description: "Start QMOI AI with Windows"; GroupDescription: "Startup:"; Flags: unchecked

[Registry]
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; \
    ValueType: string; ValueName: "QMOI AI"; ValueData: """{app}\qmoi_ai.exe"""; Flags: uninsdeletevalue; Tasks: autorun

[Run]
Filename: "{app}\qmoi_ai.exe"; Description: "Launch QMOI AI"; Flags: nowait postinstall skipifsilent
