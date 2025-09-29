#!/usr/bin/env pwsh
Write-Host "[INFO] Starting dependency auto-fix..." -ForegroundColor Cyan

# Move to the script’s directory
Set-Location -Path (Split-Path $MyInvocation.MyCommand.Path -Parent)

# Ensure a lockfile exists before running audit fix
if (-not (Test-Path "package-lock.json") -and -not (Test-Path "yarn.lock") -and -not (Test-Path "pnpm-lock.yaml")) {
    Write-Host "[INFO] No lockfile found. Running npm install to create one..." -ForegroundColor Yellow
    npm install | Out-Host
}

# Now it is safe to run npm audit fix
Write-Host "[INFO] Running npm audit fix..." -ForegroundColor Yellow
npm audit fix --legacy-peer-deps | Out-Host

# Detect lockfile changes
$changes = git status --porcelain | Select-String "package-lock.json|yarn.lock|pnpm-lock.yaml"

if ($changes) {
    $branchName = "autosync-depsfix-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "[INFO] Dependency updates detected. Creating branch: $branchName" -ForegroundColor Yellow

    git checkout -b $branchName
    git add package*.json yarn.lock pnpm-lock.yaml 2>$null
    git commit -m "chore: auto-fix npm vulnerabilities"
    git push origin $branchName

    Write-Host "[SUCCESS] Fixes pushed successfully." -ForegroundColor Green
    Write-Host "[ACTION] Create PR: https://github.com/thealphakenya/qmoi-enhanced/pull/new/$branchName" -ForegroundColor Green
}
else {
    Write-Host "[OK] No dependency updates required." -ForegroundColor Green
}
