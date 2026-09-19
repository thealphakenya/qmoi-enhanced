[Setup]
AppName=QMOI AI
AppVersion=1.0
DefaultDirName={autopf}\QMOI AI
DefaultGroupName=QMOI AI
OutputDir=installer-output
OutputBaseFilename=qmoi-ai-setup
Compression=lzma
SolidCompression=yes

[Files]
Source: "dist\\qmoi_ai\\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\\QMOI AI"; Filename: "{app}\\qmoiexe.exe"
Name: "{commondesktop}\\QMOI AI"; Filename: "{app}\\qmoiexe.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Create a desktop icon"; GroupDescription: "Additional icons:"
