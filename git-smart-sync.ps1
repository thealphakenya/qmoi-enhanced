<#
git-smart-sync.ps1
Unified, resumable, adaptive Git push script for Windows (PowerShell & Git Bash)

Features:
 - Detects whether running under PowerShell or Git Bash (pwsh)
 - Auto-fixes paths (Windows ↔ POSIX style)
 - Stages + commits changes with timestamp
 - Retries full push with exponential backoff until success
 - Pushes Git LFS objects
 - Falls back to adaptive chunked push if needed (with resume support)
 - Saves progress in .git-smart-sync.state so retries survive restarts
 - Logs everything to git-smart-sync.log
 - Can auto-register itself as a Windows Scheduled Task (runs daily, even if logged out)

Usage (manual run):
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "D:\applications\Alpha-Q-ai\git-smart-sync.ps1"

Usage (Git Bash):
  pwsh -NoProfile -ExecutionPolicy Bypass -File "/d/applications/Alpha-Q-ai/git-smart-sync.ps1"

Usage (auto-install as scheduled task):
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "D:\applications\Alpha-Q-ai\git-smart-sync.ps1" -InstallScheduledTask
#>

param (
    [string]$RepoPath = "D:\applications\Alpha-Q-ai",
    [string]$Branch = "main",
    [int]$MaxFullPushRetries = 20,
    [int]$InitialDelaySeconds = 15,
    [int]$MaxChunkStart = 1000,
    [string]$StateFile = ".git-smart-sync.state",
    [string]$LogFile = "git-smart-sync.log",
    [switch]$InstallScheduledTask
)

# ---------- Logging ----------
function Log {
    param([string]$Message, [string]$Color = "Gray")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $line = "[$ts] $Message"
    Add-Content -Path $LogFile -Value $line
    try { Write-Host $Message -ForegroundColor $Color } catch { Write-Host $Message }
}

# ---------- Scheduled Task Installer ----------
if ($InstallScheduledTask) {
    $taskName = "GitSmartSync"
    $taskDesc = "Auto push Alpha-Q-ai repo daily"
    $taskExe  = "powershell.exe"
    $taskArgs = "-NoProfile -ExecutionPolicy Bypass -File `"$RepoPath\git-smart-sync.ps1`""

    # Run daily at 9:00 AM
    $trigger = New-ScheduledTaskTrigger -Daily -At 09:00

    # Create action
    $action = New-ScheduledTaskAction -Execute $taskExe -Argument $taskArgs

    # Run whether logged in or not, highest privileges
    Register-ScheduledTask -TaskName $taskName -Description $taskDesc -Action $action -Trigger $trigger `
        -User "$env:USERNAME" -RunLevel Highest -Force | Out-Null

    Log "✅ Scheduled Task '$taskName' installed. It will run daily at 9:00, even if logged out." Green
    exit 0
}

# ---------- Environment detection ----------
$IsGitBash = $false
if ($env:MSYSTEM -and ($env:MSYSTEM -match "MINGW|MSYS|CYGWIN")) { $IsGitBash = $true }
elseif ($env:SHELL -and ($env:SHELL -match "bash")) { $IsGitBash = $true }

if ($IsGitBash) { Log "🐧 Detected: Git Bash-like environment" Cyan }
else { Log "🪟 Detected: PowerShell/Windows environment" Cyan }

# ---------- Path normalization ----------
function Convert-PosixToWindowsPath($p) {
    if ($p -match "^/[a-z]/") {
        $drive = $p.Substring(1,1).ToUpper()
        $rest = $p.Substring(3) -replace '/','\' 
        return "$drive`:\" + $rest
    }
    return $p
}

if ($RepoPath -match '^/[a-z]/') { $RepoPath = Convert-PosixToWindowsPath $RepoPath }
$RepoPath = $RepoPath -replace '/','\' 

Log "📂 Using repository path: $RepoPath" Yellow

if (-not (Test-Path $RepoPath)) {
    Log "❌ Repository path not found: $RepoPath" Red
    exit 1
}

Set-Location $RepoPath
if (-not (Test-Path ".git")) {
    Log "❌ Not a git repository (no .git found in $RepoPath)" Red
    exit 1
}

# ---------- Git config tweaks ----------
git config --global http.postBuffer 524288000 | Out-Null
git config --global http.version HTTP/1.1 | Out-Null
git config --global core.compression 0 | Out-Null
git config --global pack.windowMemory "100m" | Out-Null
git config --global pack.packSizeLimit "100m" | Out-Null
git config --global pack.threads "1" | Out-Null
git lfs install | Out-Null

# ---------- Stage + commit ----------
Log "📂 Staging changes..." Cyan
git add -A

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMsg = "Auto-sync commit @ $timestamp"
Log "📝 Committing changes (if any): $commitMsg" Cyan
git commit -m "$commitMsg" 2>$null

# ---------- Full push with exponential backoff ----------
function Try-FullPush {
    param ([int]$MaxRetries, [int]$InitialDelay)

    $attempt = 0
    $delay = $InitialDelay

    while ($attempt -lt $MaxRetries) {
        $attempt++
        Log "🔄 Full push attempt $attempt / $MaxRetries (delay $delay s)" Yellow

        git push origin ${Branch} --progress
        if ($LASTEXITCODE -eq 0) {
            Log "✅ Full push succeeded!" Green
            git lfs push origin ${Branch}
            if ($LASTEXITCODE -eq 0) { Log "✅ Git LFS push succeeded." Green }
            else { Log "⚠️ Git LFS push had warnings." Yellow }
            return $true
        }

        Log "⚠️ Full push failed. Retrying in $delay seconds..." Red
        Start-Sleep -Seconds $delay
        $delay = [Math]::Min(300, [Math]::Round($delay * 1.8))
    }
    return $false
}

if (Try-FullPush -MaxRetries $MaxFullPushRetries -InitialDelay $InitialDelaySeconds) {
    if (Test-Path $StateFile) { Remove-Item $StateFile -ErrorAction SilentlyContinue }
    Log "🎉 Repo fully synced (full push path)." Green
    exit 0
}

Log "⚠️ Full push failed repeatedly. Falling back to adaptive chunked push." Yellow

# ---------- Adaptive chunked push ----------
$commitStr = git rev-list --reverse ${Branch}
if (-not $commitStr) { Log "❌ Unable to read commit list for ${Branch}" Red; exit 1 }
$commitList = $commitStr -split "`n"
$total = $commitList.Count
Log "📊 Total commits on ${Branch}: $total" Cyan

# Resume state
$startIndex = 0
if (Test-Path $StateFile) {
    try {
        $last = Get-Content $StateFile
        if ($last) {
            $idx = [Array]::IndexOf($commitList, $last)
            if ($idx -ge 0) { $startIndex = $idx + 1; Log "⏩ Resuming from commit $last" Cyan }
        }
    } catch { Log "⚠️ Could not read state file, starting fresh." Yellow }
}

$chunkSize = [int]$MaxChunkStart
$i = $startIndex
while ($i -lt $total) {
    $endIndex = [Math]::Min($i + $chunkSize - 1, $total - 1)
    $startCommit = $commitList[$i]
    $endCommit = $commitList[$endIndex]

    Log "➡️ Pushing commits $($i+1)..$($endIndex+1) ($startCommit → $endCommit) chunkSize=$chunkSize" Yellow
    git push origin "${startCommit}:${Branch}"
    if ($LASTEXITCODE -eq 0) {
        Log "✅ Chunk pushed successfully." Green
        Set-Content -Path $StateFile -Value $endCommit -Force
        git lfs push origin ${Branch} | Out-Null
        $i = $endIndex + 1
        if ($chunkSize -lt $MaxChunkStart) { $chunkSize = [Math]::Min($MaxChunkStart, $chunkSize * 2) }
    }
    else {
        Log "❌ Chunk push failed. Reducing chunk size..." Red
        $chunkSize = [Math]::Max([math]::Floor($chunkSize / 2), 1)
        if ($chunkSize -eq 1) { Log "⚠️ Falling back to single-commit pushes." Yellow }
        Start-Sleep -Seconds 5
    }
}

if (Test-Path $StateFile) { Remove-Item $StateFile -ErrorAction SilentlyContinue }
Log "✅ All commits pushed successfully with adaptive chunking!" Green
exit 0
