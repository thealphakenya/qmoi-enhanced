[Setup]
AppName=QMOI AI
AppVersion=1.0.0
DefaultDirName={autopf}\QMOI AI
DefaultGroupName=QMOI AI
OutputBaseFilename=qmoi_ai_installer
Compression=lzma
SolidCompression=yes
SetupIconFile=qmoi_ai_icon.ico

[Files]
Source: "dist\qmoi ai.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\QMOI AI"; Filename: "{app}\qmoi ai.exe"
Name: "{desktop}\QMOI AI"; Filename: "{app}\qmoi ai.exe"

[Run]
Filename: "{app}\qmoi ai.exe"; Description: "Launch QMOI AI"; Flags: nowait postinstall skipifsilent
