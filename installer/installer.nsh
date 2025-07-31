!include "MUI2.nsh"

!define PRODUCT_NAME "QMOI AI"
!define PRODUCT_VERSION "1.0.0"
!define COMPANY_NAME "QMOI System"
!define WEBSITE "https://github.com/thealphakenya/Alpha-Q-ai"
!define SUPPORT_EMAIL "support@qmoi.ai"

!define MUI_WELCOMEPAGE_TITLE "Welcome to the QMOI AI Setup Wizard"
!define MUI_FINISHPAGE_TITLE "QMOI AI Setup Completed"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "installer/LICENSE.txt"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

Section "QMOI AI (Required)"
  SetOutPath "$INSTDIR"
  File /r "dist\*.*"
  CreateShortcut "$DESKTOP\QMOI AI.lnk" "$INSTDIR\qmoiexe.exe"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

Function .onInit
  SetShellVarContext all
FunctionEnd

Function un.onInit
  SetShellVarContext all
FunctionEnd

Section "Uninstall"
  Delete "$INSTDIR\qmoiexe.exe"
  Delete "$DESKTOP\QMOI AI.lnk"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR"
SectionEnd
