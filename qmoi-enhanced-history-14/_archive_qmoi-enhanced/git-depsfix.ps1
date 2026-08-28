#!/usr/bin/env pwsh
Write-Host "[INFO] Starting dependency auto-fix..." -ForegroundColor Cyan

# Go to repo root
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Host "[ERROR] Not inside a git repo. Aborting." -ForegroundColor Red
    exit 1
}
Set-Location $repoRoot

# Check for package.json
if (-Not (Test-Path "package.json")) {
    Write-Host "[WARN] No package.json found. Nothing to fix." -ForegroundColor Yellow
    exit 0
}

# Retry helper
function Run-Safe($cmd, $maxRetries = 3) {
    for ($i=1; $i -le $maxRetries; $i++) {
        Write-Host "[CMD] $cmd (attempt $i)" -ForegroundColor DarkGray
        try {
            iex $cmd
            if ($LASTEXITCODE -eq 0) { return $true }
        } catch {
            Write-Host "[WARN] Failed: $_" -ForegroundColor Yellow
        }
        Start-Sleep -Seconds 2
    }
    return $false
}

# Step 1: Ensure lockfile
if (-Not (Test-Path "package-lock.json")) {
    Write-Host "[INFO] No package-lock.json found. Running npm install..." -ForegroundColor Yellow
    if (-not (Run-Safe "npm install --legacy-peer-deps")) {
        Write-Host "[ERROR] npm install failed after retries. Cannot continue." -ForegroundColor Red
        exit 1
    }
}

# Step 2: Audit fix (only if lockfile exists)
if (Test-Path "package-lock.json") {
    Write-Host "[INFO] Running npm audit fix..." -ForegroundColor Yellow
    Run-Safe "npm audit fix --legacy-peer-deps" | Out-Null
} else {
    Write-Host "[WARN] Skipping npm audit fix (no package-lock.json could be created)." -ForegroundColor DarkYellow
}

# Step 3: Commit & push if changes
$changes = git status --porcelain | Select-String "package.json|package-lock.json"

if ($changes) {
    $branchName = "autosync-depsfix-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "[INFO] Creating branch: $branchName" -ForegroundColor Yellow

    git checkout -b $branchName
    git add package*.json
    git commit -m "chore: auto-fix npm dependencies"
    git push origin $branchName

    Write-Host "[SUCCESS] Fixes pushed." -ForegroundColor Green
    Write-Host "[ACTION] Open PR: https://github.com/thealphakenya/qmoi-enhanced/pull/new/$branchName" -ForegroundColor Green
} else {
    Write-Host "[OK] No dependency updates required." -ForegroundColor Green
}
