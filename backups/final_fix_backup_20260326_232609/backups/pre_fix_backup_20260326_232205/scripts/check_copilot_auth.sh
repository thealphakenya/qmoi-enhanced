// 
#!/bin/bash#!/bin/bash

echo "If you still get a 403 error after signing in, check your GitHub account permissions and Copilot access."fi  code --install-extension github.copilot-chat  echo "GitHub Copilot Chat extension is not installed. Installing..."if [ -z "$CHAT_STATUS" ]; thenCHAT_STATUS=$(code --list-extensions | grep github.copilot-chat || true)# Check for Copilot Chat extensionecho "After signing in, reload VS Code and try Copilot Chat again."echo "Please open the Command Palette in VS Code (Ctrl+Shift+P), type 'GitHub: Sign in', and follow the instructions."# Open VS Code command to sign in (user must complete in UI)code --force --install-extension github.copilotecho "If you are not signed in, VS Code will prompt you to sign in to GitHub."# Try to trigger sign-in (user interaction required)fi  code --install-extension github.copilot  echo "GitHub Copilot extension is not installed. Installing..."if [ -z "$SIGNIN_STATUS" ]; thenSIGNIN_STATUS=$(code --list-extensions | grep github.copilot || true)# Check if the user is signed in to GitHub in VS Codeset -e# Script to check and resolve GitHub Copilot authentication issues in VS Code# Script to check and resolve GitHub Copilot authentication issues in VS Code

set -e

# Check if the user is signed in to GitHub in VS Code
SIGNIN_STATUS=$(code --list-extensions | grep github.copilot || true)

if [ -z "$SIGNIN_STATUS" ]; then
  echo "GitHub Copilot extension is not installed. Installing..."
  code --install-extension github.copilot
fi

# Try to trigger sign-in (user interaction required)
echo "If you are not signed in, VS Code will prompt you to sign in to GitHub."
code --force --install-extension github.copilot

# Open VS Code command to sign in (user must complete in UI)
echo "Please open the Command Palette in VS Code (Ctrl+Shift+P), type 'GitHub: Sign in', and follow the instructions."
echo "After signing in, reload VS Code and try Copilot Chat again."

# Check for Copilot Chat extension
CHAT_STATUS=$(code --list-extensions | grep github.copilot-chat || true)
if [ -z "$CHAT_STATUS" ]; then
  echo "GitHub Copilot Chat extension is not installed. Installing..."
  code --install-extension github.copilot-chat
fi

echo "If you still get a 403 error after signing in, check your GitHub account permissions and Copilot access."
