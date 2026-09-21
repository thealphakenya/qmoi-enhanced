y
# Quick Git Push - One Command Solution
# Usage: powershell -ExecutionPolicy Bypass -File quick-push.ps1

Write-Host "🚀 Quick Git Push Automation" -ForegroundColor Magenta
Write-Host "=============================" -ForegroundColor Magenta

# Set git config
git config --global core.autocrlf true 2>$null
git config --global core.safecrlf false 2>$null

# Remove locks
if (Test-Path ".git/index.lock") { Remove-Item ".git/index.lock" -Force }
if (Test-Path ".git/refs/heads/main.lock") { Remove-Item ".git/refs/heads/main.lock" -Force }

# Clean and prepare
git clean -fd 2>$null
git reset HEAD 2>$null
git add -A

# Commit if changes exist
$hasChanges = git diff --cached --quiet; if ($LASTEXITCODE -ne 0) { 
    git commit -m "Auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 
}

# Pull with conflict resolution
git pull origin main --rebase --no-edit 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Rebase failed, trying merge..." -ForegroundColor Yellow
    git pull origin main --no-rebase --no-edit 2>$null
}

# Push
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SUCCESS! Push completed!" -ForegroundColor Green
} else {
    Write-Host "❌ Push failed. Check network and try again." -ForegroundColor Red
}

Write-Host "`nFinal Status:" -ForegroundColor Cyan
git status --short
