# git-smart-sync.ps1
# Full Git automation: add, commit, push with retries and error handling

param (
    [string]$RepoPath = "D:\applications\Alpha-Q-ai",
    [string]$Branch = "main",
    [int]$MaxRetries = 10,
    [int]$DelaySeconds = 15
)

Write-Host "🚀 Starting Smart Git Sync on branch $Branch" -ForegroundColor Cyan

# Go to repo
Set-Location $RepoPath

# Configure Git for large pushes
git config --global http.postBuffer 524288000 | Out-Null
git config --global http.version HTTP/1.1 | Out-Null
git config --global core.compression 0 | Out-Null
git config --global pack.windowMemory "100m" | Out-Null
git config --global pack.packSizeLimit "100m" | Out-Null
git config --global pack.threads "1" | Out-Null

# Ensure LFS is ready
git lfs install | Out-Null

# Stage all changes
Write-Host "📂 Staging changes..." -ForegroundColor Cyan
git add -A

# Commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMsg = "Auto-sync commit @ $timestamp"
Write-Host "📝 Committing changes: $commitMsg" -ForegroundColor Cyan
git commit -m "$commitMsg" 2>$null

$retry = 0
$success = $false

while (-not $success -and $retry -lt $MaxRetries) {
    $retry++
    Write-Host "🔄 Attempt $retry of $MaxRetries to push..." -ForegroundColor Yellow

    try {
        git push -u origin $Branch --progress
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Push completed successfully!" -ForegroundColor Green
            $success = $true
            break
        } else {
            throw "Push failed with exit code $LASTEXITCODE"
        }
    }
    catch {
        Write-Host "⚠️ Push failed: $($_.Exception.Message)" -ForegroundColor Red

        # Retry Git LFS push
        Write-Host "📦 Retrying Git LFS push..." -ForegroundColor Cyan
        git lfs push origin $Branch

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ LFS push completed successfully!" -ForegroundColor Green
            $success = $true
            break
        }

        Write-Host "⏳ Waiting $DelaySeconds seconds before retry..." -ForegroundColor DarkGray
        Start-Sleep -Seconds $DelaySeconds
    }
}

if (-not $success) {
    Write-Host "❌ All retries failed. Please check your network or split the push into smaller commits." -ForegroundColor Red
    exit 1
}
