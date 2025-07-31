!define APP_NAME "QMOI AI"
!define EXE_NAME "qmoiexe.exe"
!define INSTALL_DIR "$PROGRAMFILES\\QMOI AI"
!define SHORTCUT_NAME "QMOI AI.lnk"
!define UNINSTALL_EXE "uninstall.exe"
!define ICON_PATH "public\\icon.ico"

OutFile "QMOI_AI_Installer.exe"
InstallDir "${INSTALL_DIR}"
RequestExecutionLevel admin

Page directory
Page instfiles
UninstPage uninstConfirm
UninstPage instfiles

Var StartMenuFolder

Section "Install"
    SetOutPath "$INSTDIR"
    SetOverwrite on

    ; Copy all built app files
    File /r "dist\\qmoiexe\\*.*"

    ; Add app icon if it exists
    IfFileExists "${ICON_PATH}" 0 +2
        SetIcon "${ICON_PATH}"

    ; Create shortcuts
    CreateShortcut "$DESKTOP\\${SHORTCUT_NAME}" "$INSTDIR\\${EXE_NAME}" "" "$INSTDIR\\${EXE_NAME}" 0
    CreateShortcut "$SMSTARTUP\\${SHORTCUT_NAME}" "$INSTDIR\\${EXE_NAME}" "" "$INSTDIR\\${EXE_NAME}" 0

    ; Write uninstall registry info
    WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${APP_NAME}" "DisplayName" "${APP_NAME}"
    WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${APP_NAME}" "UninstallString" "$INSTDIR\\${UNINSTALL_EXE}"
    WriteUninstaller "$INSTDIR\\${UNINSTALL_EXE}"
SectionEnd

Section "Uninstall"
    ; Remove shortcuts
    Delete "$DESKTOP\\${SHORTCUT_NAME}"
    Delete "$SMSTARTUP\\${SHORTCUT_NAME}"

    ; Remove uninstall entry
    DeleteRegKey HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${APP_NAME}"

    ; Remove installed files
    RMDir /r "$INSTDIR"
SectionEnd
