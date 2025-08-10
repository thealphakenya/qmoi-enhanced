; build-windows-installer.nsi
!include "MUI2.nsh"

Name "QMOI AI"
OutFile "${OUTPUT_NAME}"
InstallDir "$PROGRAMFILES\\QMOI AI"
ShowInstDetails show

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  File "${EXE_SOURCE}"
  CreateShortcut "$SMPROGRAMS\\QMOI AI.lnk" "$INSTDIR\\${EXE_SOURCE}"
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\\*.*"
  RMDir /r "$INSTDIR"
  Delete "$SMPROGRAMS\\QMOI AI.lnk"
SectionEnd
