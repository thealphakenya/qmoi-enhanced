# Simple Git Push Automation Script
# This script handles git operations with basic error handling

Write-Host "🚀 Starting Git Push Automation" -ForegroundColor Magenta
Write-Host "=================================" -ForegroundColor Magenta

# Step 1: Environment Setup
Write-Host "`n=== Step 1: Environment Setup ===" -ForegroundColor Cyan
git config --global core.autocrlf true
git config --global core.safecrlf false

# Step 2: Repository Health Check
Write-Host "`n=== Step 2: Repository Health Check ===" -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    Write-Host "❌ Not a git repository!" -ForegroundColor Red
    exit 1
}

# Check if we're on main branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "⚠️  Not on main branch (current: $currentBranch). Switching to main..." -ForegroundColor Yellow
    git checkout main
}

# Step 3: Clean Repository
Write-Host "`n=== Step 3: Repository Cleanup ===" -ForegroundColor Cyan

# Remove lock files if they exist
if (Test-Path ".git/index.lock") {
    Write-Host "Removing stale index lock..." -ForegroundColor Yellow
    Remove-Item ".git/index.lock" -Force
}

if (Test-Path ".git/refs/heads/main.lock") {
    Write-Host "Removing stale branch lock..." -ForegroundColor Yellow
    Remove-Item ".git/refs/heads/main.lock" -Force
}

# Clean untracked files (force without prompts)
Write-Host "Cleaning untracked files..." -ForegroundColor Yellow
git clean -fd -f

# Step 4: Reset and Prepare
Write-Host "`n=== Step 4: Reset and Prepare ===" -ForegroundColor Cyan
git reset HEAD
git add -A

# Step 5: Commit Changes
Write-Host "`n=== Step 5: Commit Changes ===" -ForegroundColor Cyan
$hasChanges = git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    $commitMessage = "Auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Automated updates and cleanup"
    git commit -m $commitMessage
    Write-Host "✅ Changes committed!" -ForegroundColor Green
} else {
    Write-Host "No changes to commit." -ForegroundColor Green
}

# Step 6: Pull with Conflict Resolution
Write-Host "`n=== Step 6: Pull with Conflict Resolution ===" -ForegroundColor Cyan
$pullSuccess = $false

# Try pull with rebase first
Write-Host "Attempting pull with rebase..." -ForegroundColor Yellow
git pull origin main --rebase --no-edit
if ($LASTEXITCODE -eq 0) {
    $pullSuccess = $true
    Write-Host "✅ Pull with rebase successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Rebase failed. Trying merge strategy..." -ForegroundColor Red
    
    # Check if we're in a rebase state and abort if needed
    if (Test-Path ".git/rebase-merge") {
        Write-Host "Aborting rebase..." -ForegroundColor Yellow
        git rebase --abort
    }
    
    # Try merge strategy
    git pull origin main --no-rebase --no-edit
    if ($LASTEXITCODE -eq 0) {
        $pullSuccess = $true
        Write-Host "✅ Merge pull successful!" -ForegroundColor Green
    }
}

if (-not $pullSuccess) {
    Write-Host "❌ All pull attempts failed. Manual intervention required." -ForegroundColor Red
    Write-Host "Current status:" -ForegroundColor Yellow
    git status
    exit 1
}

# Step 7: Push to Remote
Write-Host "`n=== Step 7: Push to Remote ===" -ForegroundColor Cyan
$pushSuccess = $false
$maxPushRetries = 3

for ($i = 1; $i -le $maxPushRetries; $i++) {
    Write-Host "Push attempt $i/$maxPushRetries..." -ForegroundColor Yellow
    
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        $pushSuccess = $true
        Write-Host "✅ Push successful!" -ForegroundColor Green
        break
    } else {
        Write-Host "❌ Push failed. Retrying..." -ForegroundColor Red
        if ($i -lt $maxPushRetries) {
            Start-Sleep -Seconds 5
        }
    }
}

# Step 8: Final Verification
Write-Host "`n=== Step 8: Final Verification ===" -ForegroundColor Cyan
if ($pushSuccess) {
    Write-Host "🎉 SUCCESS! All operations completed successfully!" -ForegroundColor Green
    Write-Host "Current branch: $(git branch --show-current)" -ForegroundColor Cyan
    Write-Host "Latest commit: $(git log -1 --oneline)" -ForegroundColor Cyan
} else {
    Write-Host "❌ Push failed after all attempts." -ForegroundColor Red
    Write-Host "Please check your network connection and try manually:" -ForegroundColor Yellow
    Write-Host "git push origin main" -ForegroundColor White
}

# Show final status
Write-Host "`nFinal Repository Status:" -ForegroundColor Magenta
git status --short

Write-Host "`nScript execution completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green
