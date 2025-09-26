# git-smart-sync.ps1
# Full Git automation: add, commit, adaptive push with retries, chunking, error handling, resume support
# Works in both PowerShell and Git Bash environments.

param (
    [string]$RepoPath = "D:\applications\Alpha-Q-ai",
    [string]$Branch = "main",
    [int]$MaxRetries = 20,
    [int]$DelaySeconds = 20,
    [string]$StateFile = ".git-smart-sync.state"
)

# --- Detect Shell Environment ---
$IsGitBash = $false
if ($env:SHELL -like "*bash*" -or $env:MSYSTEM -like "MINGW*") {
    $IsGitBash = $true
}

if ($IsGitBash) {
    Write-Host "🐧 Running inside Git Bash" -ForegroundColor Cyan
} else {
    Write-Host "🪟 Running inside PowerShell" -ForegroundColor Cyan
}

# --- Normalize Repo Path ---
if ($IsGitBash) {
    # Convert Windows-style path to Git Bash /c/... format
    $RepoPath = $RepoPath -replace "^(?<drive>[A-Za-z]):\\", {"/" + ($_.Groups["drive"].Value.ToLower()) + "/"} `
                         -replace "\\", "/"
}

Write-Host "📂 Repository path: $RepoPath" -ForegroundColor Yellow
Set-Location $RepoPath

# --- Git Config Optimizations ---
git config --global http.postBuffer 524288000 | Out-Null
git config --global http.version HTTP/1.1 | Out-Null
git config --global core.compression 0 | Out-Null
git config --global pack.windowMemory "100m" | Out-Null
git config --global pack.packSizeLimit "100m" | Out-Null
git config --global pack.threads "1" | Out-Null

# --- LFS Init ---
git lfs install | Out-Null

# --- Stage + Commit ---
Write-Host "📂 Staging changes..." -ForegroundColor Cyan
git add -A

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMsg = "Auto-sync commit @ $timestamp"
Write-Host "📝 Committing changes: $commitMsg" -ForegroundColor Cyan
git commit -m "$commitMsg" 2>$null

# --- Helper Function: Push with Retry ---
function Try-Push {
    param ([string]$Branch, [int]$Retries, [int]$Delay)

    $retry = 0
    while ($retry -lt $Retries) {
        $retry++
        Write-Host "🔄 Attempt $retry of $Retries to push branch $Branch..." -ForegroundColor Yellow

        git push origin $Branch --progress --no-rebase
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Git objects pushed successfully!" -ForegroundColor Green

            Write-Host "📦 Pushing Git LFS objects..." -ForegroundColor Cyan
            git lfs push origin $Branch
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ LFS push completed successfully!" -ForegroundColor Green
                return $true
            }
        }

        Write-Host "⚠️ Push failed. Retrying in $Delay seconds..." -ForegroundColor Red
        Start-Sleep -Seconds $Delay
    }

    return $false
}

# --- Normal Push First ---
if (Try-Push -Branch $Branch -Retries $MaxRetries -Delay $DelaySeconds) {
    Write-Host "🎉 Repository synced successfully!" -ForegroundColor Green
    if (Test-Path $StateFile) { Remove-Item $StateFile }
    exit 0
}

# --- Adaptive Chunked Push ---
Write-Host "⚠️ Normal push failed. Falling back to adaptive chunked push..." -ForegroundColor Yellow

$commits = git rev-list --reverse $Branch
$commitList = $commits -split "`n"
$total = $commitList.Count

# Resume if state exists
$startIndex = 0
if (Test-Path $StateFile) {
    $lastCommit = Get-Content $StateFile
    $startIndex = [Array]::IndexOf($commitList, $lastCommit) + 1
    Write-Host "⏩ Resuming from commit $lastCommit (index $startIndex)" -ForegroundColor Cyan
}

$chunkSize = 1000
Write-Host "📊 Total commits: $total. Starting from index $startIndex. Chunk size: $chunkSize" -ForegroundColor Cyan

$i = $startIndex
while ($i -lt $total) {
    $endIndex = [Math]::Min($i + $chunkSize - 1, $total - 1)
    $startCommit = $commitList[$i]
    $endCommit = $commitList[$endIndex]

    Write-Host "➡️ Pushing commits $($i+1)..$($endIndex+1) ($startCommit → $endCommit)" -ForegroundColor Yellow
    git push origin "${startCommit}:${Branch}"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Chunk pushed successfully!" -ForegroundColor Green
        Set-Content -Path $StateFile -Value $endCommit
        $i = $endIndex + 1
    }
    else {
        Write-Host "❌ Chunk push failed. Reducing chunk size..." -ForegroundColor Red
        $chunkSize = [Math]::Max([math]::Floor($chunkSize / 2), 1)
        if ($chunkSize -eq 1) {
            Write-Host "⚠️ Falling back to single-commit push mode." -ForegroundColor Yellow
        }
    }
}

Write-Host "✅ All commits pushed successfully with adaptive chunking!" -ForegroundColor Green
if (Test-Path $StateFile) { Remove-Item $StateFile }
exit 0
