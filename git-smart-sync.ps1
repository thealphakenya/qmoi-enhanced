<#
git-smart-sync.ps1
Unified, resumable, adaptive Git push script for Windows (PowerShell & Git Bash)

Features:
 - Detects environment and normalizes paths
 - Creates remote safety backup branch before sync
 - Auto-fetch + rebase/merge remote changes
 - Stages + commits changes automatically
 - Retries full push with exponential backoff
 - Pushes Git LFS separately
 - Falls back to adaptive chunked push if needed (resumes across runs)
 - Logs to git-smart-sync.log with daily rotation
 - Can auto-install as a Scheduled Task (runs even logged out)
 - Sends notification via Slack/Email (optional) or GitHub Actions (default, free)
#>

param (
    [string]$RepoPath = "D:\applications\Alpha-Q-ai",
    [string]$Branch = "main",
    [int]$MaxFullPushRetries = 20,
    [int]$InitialDelaySeconds = 15,
    [int]$MaxChunkStart = 1000,
    [string]$StateFile = ".git-smart-sync.state",
    [string]$LogFile = "git-smart-sync.log",
    [switch]$InstallScheduledTask,
    [string]$SlackWebhook = "",
    [string]$EmailTo = ""
)

# ---------- Log rotation ----------
function Rotate-Log {
    if (Test-Path $LogFile) {
        $dateStr = (Get-Date).ToString("yyyyMMdd")
        $archive = "$($LogFile -replace '\.log$', '')-$dateStr.log"
        if (-not (Test-Path $archive)) {
            try { Move-Item -Path $LogFile -Destination $archive -Force } catch {}
        }
    }
}
Rotate-Log

function Log {
    param([string]$Message, [string]$Color = "Gray")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $line = "[$ts] $Message"
    try { Add-Content -Path $LogFile -Value $line } catch {}
    try { Write-Host $Message -ForegroundColor $Color } catch { Write-Host $Message }
}

# ---------- Notifications ----------
function Send-Notification {
    param([string]$Status, [string]$Details)

    # Slack
    if ($SlackWebhook) {
        try {
            $payload = @{ text = "*Git Sync [$Status]*`n$Details" } | ConvertTo-Json -Compress
            Invoke-RestMethod -Uri $SlackWebhook -Method Post -Body $payload -ContentType 'application/json'
            Log "📣 Slack notification sent." Cyan
        } catch { Log "⚠️ Failed to send Slack notification: $($_.Exception.Message)" Yellow }
    }

    # Email
    if ($EmailTo) {
        try {
            $subject = "Git Sync [$Status] - $RepoPath"
            $body = "$Details`nLog: $LogFile"
            Send-MailMessage -To $EmailTo -From "autosync@$env:COMPUTERNAME" `
                -Subject $subject -Body $body -SmtpServer "localhost" -ErrorAction SilentlyContinue
            Log "📧 Email notification attempted." Cyan
        } catch { Log "⚠️ Failed to send email notification: $($_.Exception.Message)" Yellow }
    }

    # GitHub notification branch (default)
    try {
        $NotifyBranch = "sync-notify"
        $LogFilePath = ".sync-log"
        $TimeNow = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

        "$TimeNow - $Status - $Details" | Out-File -FilePath $LogFilePath -Encoding utf8

        git checkout -B $NotifyBranch
        git add $LogFilePath
        git commit -m "🔔 Sync $Status at $TimeNow"
        git push origin $NotifyBranch --force
        git checkout $Branch
        Log "📡 GitHub notification branch updated." Cyan
    } catch {
        Log "⚠️ Failed to push notification branch: $($_.Exception.Message)" Yellow
    }
}

# ---------- Path conversion ----------
function Convert-PosixToWindowsPath($p) {
    if ($p -match "^/[a-z]/") {
        $drive = $p.Substring(1,1).ToUpper()
        $rest = $p.Substring(3) -replace '/','\' 
        return "$drive`:\" + $rest
    }
    return $p
}

# ---------- Scheduled Task Installer ----------
if ($InstallScheduledTask) {
    try {
        $taskName = "GitSmartSync"
        $taskDesc = "Auto push Alpha-Q-ai repo"
        $taskExe  = "powershell.exe"
        $taskArgs = "-NoProfile -ExecutionPolicy Bypass -File `"$RepoPath\git-smart-sync.ps1`""

        $dailyTrigger = New-ScheduledTaskTrigger -Daily -At 09:00
        $startupTrigger = New-ScheduledTaskTrigger -AtStartup
        $action = New-ScheduledTaskAction -Execute $taskExe -Argument $taskArgs

        try { Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue } catch {}

        Register-ScheduledTask -TaskName $taskName -Description $taskDesc -Action $action `
            -Trigger @($dailyTrigger, $startupTrigger) -User "$env:USERNAME" -RunLevel Highest -Force | Out-Null

        Log "✅ Scheduled Task '$taskName' installed (daily & at startup, runs even logged out)." Green
    } catch {
        Log "❌ Failed to install scheduled task: $($_.Exception.Message)" Red
    }
    exit 0
}

# ---------- Detect environment ----------
$IsGitBash = $false
if ($env:MSYSTEM -and ($env:MSYSTEM -match "MINGW|MSYS|CYGWIN")) { $IsGitBash = $true }
elseif ($env:SHELL -and ($env:SHELL -match "bash")) { $IsGitBash = $true }
if ($IsGitBash) { Log "🐧 Git Bash-like environment" Cyan } else { Log "🪟 PowerShell/Windows environment" Cyan }

# ---------- Normalize repo path ----------
if ($RepoPath -match '^/[a-z]/') { $RepoPath = Convert-PosixToWindowsPath $RepoPath }
$RepoPath = $RepoPath -replace '/','\' 
if (-not (Test-Path $RepoPath)) { Log "❌ Repo path not found: $RepoPath" Red; exit 1 }
Set-Location $RepoPath
if (-not (Test-Path ".git")) { Log "❌ Not a git repository in $RepoPath" Red; exit 1 }

# ---------- Git tweaks ----------
git config --global http.postBuffer 524288000 | Out-Null
git config --global core.compression 0 | Out-Null
git config --global pack.windowMemory "100m" | Out-Null
git config --global pack.packSizeLimit "100m" | Out-Null
git config --global pack.threads "1" | Out-Null
git lfs install | Out-Null

# ---------- Safety backup branch ----------
$ts = (Get-Date).ToString("yyyyMMdd-HHmmss")
$backupBranch = "autosync-backup-$ts"
git branch -f $backupBranch HEAD
git push origin $backupBranch --set-upstream | Out-Null

# ---------- Fetch + rebase ----------
git fetch --prune origin $Branch
git rebase --autostash origin/$Branch 2>$null
if ($LASTEXITCODE -ne 0) {
    git merge -X theirs origin/$Branch --no-edit 2>$null
    if ($LASTEXITCODE -ne 0) { git rebase --abort 2>$null; git merge --abort 2>$null }
}

# ---------- Commit local changes ----------
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    $commitMsg = "Auto-sync commit @ $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git commit -m "$commitMsg" | Out-Null
}

# ---------- Full push with backoff ----------
function Try-FullPush {
    param([int]$MaxRetries, [int]$InitialDelay)
    $delay = $InitialDelay
    for ($i=1; $i -le $MaxRetries; $i++) {
        git push origin $Branch --progress
        if ($LASTEXITCODE -eq 0) {
            git lfs push origin $Branch | Out-Null
            return $true
        }
        Start-Sleep -Seconds $delay
        $delay = [Math]::Min(300, [Math]::Round($delay * 1.8))
    }
    return $false
}

if (Try-FullPush -MaxRetries $MaxFullPushRetries -InitialDelay $InitialDelaySeconds) {
    if (Test-Path $StateFile) { Remove-Item $StateFile -ErrorAction SilentlyContinue }
    Log "🎉 Repo fully synced." Green
    Send-Notification "SUCCESS" "Repo $RepoPath fully synced to branch $Branch."
    exit 0
}

# ---------- Adaptive chunked push ----------
$commitStr = git rev-list --reverse $Branch
if (-not $commitStr) { Log "❌ No commits found for $Branch"; exit 1 }
$commitList = $commitStr -split "`n"
$total = $commitList.Count

$startIndex = 0
if (Test-Path $StateFile) {
    $last = Get-Content $StateFile
    $idx = [Array]::IndexOf($commitList, $last)
    if ($idx -ge 0) { $startIndex = $idx + 1 }
}

$chunkSize = $MaxChunkStart
for ($i=$startIndex; $i -lt $total;) {
    $endIndex = [Math]::Min($i + $chunkSize - 1, $total - 1)
    $startCommit = $commitList[$i]
    $endCommit = $commitList[$endIndex]

    git push origin "${startCommit}:$Branch"
    if ($LASTEXITCODE -eq 0) {
        Set-Content -Path $StateFile -Value $endCommit -Force
        git lfs push origin $Branch | Out-Null
        $i = $endIndex + 1
        if ($chunkSize -lt $MaxChunkStart) { $chunkSize = [Math]::Min($MaxChunkStart, $chunkSize * 2) }
    } else {
        $chunkSize = [Math]::Max([math]::Floor($chunkSize / 2), 1)
        if ($chunkSize -eq 1) {
            $safetyBranch = "autosync-safety-$ts"
            git branch -f $safetyBranch $startCommit
            git push origin $safetyBranch --set-upstream | Out-Null
        }
        Start-Sleep -Seconds 5
    }
}

if (Test-Path $StateFile) { Remove-Item $StateFile -ErrorAction SilentlyContinue }
Log "✅ All commits pushed with adaptive chunking." Green
Send-Notification "SUCCESS" "Repo $RepoPath fully synced with adaptive chunking."
exit 0
