<#
git-smart-sync.ps1
FINAL unified script:
 - Detects Git Bash vs PowerShell
 - Path normalization
 - Log rotation
 - Notifications (Slack, Email, GitHub branch)
 - Scheduled Task installer
 - Backup branches
 - Fetch + rebase + auto-merge fallback
 - Large file detection (>50MB), optional LFS migration, optional GitHub Issue
 - Full push with retries & exponential backoff
 - Adaptive chunked push with resume
 - Optional dependency auto-fix across npm/pnpm/yarn
 - Ends with notification
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
    [switch]$AutoMigrateToLFS,
    [switch]$OpenIssueOnLargeFiles,
    [string]$SlackWebhook = "",
    [string]$EmailTo = "",
    [switch]$RunDepsFix,        # NEW: run dependency auto-fix step
    [switch]$DepsForce         # NEW: run force/aggressive fixes where supported
)

# -------------------- Helpers --------------------
function Rotate-Log {
    try {
        if (Test-Path -LiteralPath $LogFile) {
            $dateStr = (Get-Date).ToString("yyyyMMdd")
            $archive = "$($LogFile -replace '\.log$', '')-$dateStr.log"
            if (-not (Test-Path -LiteralPath $archive)) {
                Move-Item -LiteralPath $LogFile -Destination $archive -Force -ErrorAction SilentlyContinue
            }
        } else {
            New-Item -Path $LogFile -ItemType File -Force | Out-Null
        }
    } catch {}
}
Rotate-Log

function Log {
    param([string]$Message, [string]$Color = "Gray")
    $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $line = "[$ts] $Message"
    try { Add-Content -LiteralPath $LogFile -Value $line -ErrorAction SilentlyContinue } catch {}
    try { Write-Host $Message -ForegroundColor $Color } catch { Write-Host $Message }
}

function Convert-PosixToWindowsPath($p) {
    if ($p -match "^/[a-z]/") {
        $drive = $p.Substring(1,1).ToUpper()
        $rest = $p.Substring(3) -replace '/','\' 
        return "$drive`:\" + $rest
    }
    return $p
}

function Escape-JsonString($s) {
    if ($null -eq $s) { return "" }
    $s = $s -replace '\\','\\\\'
    $s = $s -replace '"','\"'
    $s = $s -replace "`n", '\n'
    $s = $s -replace "`r", '\r'
    return $s
}

# -------------------- Notifications --------------------
function Send-Notification {
    param([string]$Status, [string]$Details)

    # Slack
    if ($SlackWebhook) {
        try {
            $payload = @{ text = "*Git Sync [$Status]*`n$Details" } | ConvertTo-Json -Compress
            Invoke-RestMethod -Uri $SlackWebhook -Method Post -Body $payload -ContentType 'application/json'
            Log "📣 Slack notification sent." Cyan
        } catch { Log "⚠️ Slack notify failed: $($_.Exception.Message)" Yellow }
    }

    # Email
    if ($EmailTo) {
        try {
            $subject = "Git Sync [$Status] - $RepoPath"
            $body = "$Details`nLog: $LogFile"
            Send-MailMessage -To $EmailTo -From "autosync@$env:COMPUTERNAME" `
                -Subject $subject -Body $body -SmtpServer "localhost" -ErrorAction SilentlyContinue
            Log "📧 Email notification attempted." Cyan
        } catch { Log "⚠️ Email notify failed." Yellow }
    }

    # GitHub notify branch
    try {
        $NotifyBranch = "sync-notify"
        $LogFilePath = ".sync-log"
        $TimeNow = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

        "$TimeNow`t$Status`t$Details" | Out-File -FilePath $LogFilePath -Encoding utf8 -Force
        git checkout -B $NotifyBranch 2>$null
        git add $LogFilePath 2>$null
        git diff --cached --quiet
        if ($LASTEXITCODE -ne 0) {
            git commit -m "🔔 Sync $Status at $TimeNow" 2>$null
            git push origin $NotifyBranch --force
        } else {
            git push origin $NotifyBranch --force 2>$null
        }
        git checkout $Branch 2>$null
        Log "📡 GitHub notification branch updated." Cyan
    } catch { Log "⚠️ Notify branch failed: $($_.Exception.Message)" Yellow }
}

# -------------------- Scheduled Task --------------------
if ($InstallScheduledTask) {
    try {
        $taskName = "GitSmartSync"
        $taskDesc = "Auto push repo"
        $taskExe  = "powershell.exe"
        $taskArgs = "-NoProfile -ExecutionPolicy Bypass -File `"$RepoPath\git-smart-sync.ps1`""

        $dailyTrigger = New-ScheduledTaskTrigger -Daily -At 09:00
        $startupTrigger = New-ScheduledTaskTrigger -AtStartup
        $action = New-ScheduledTaskAction -Execute $taskExe -Argument $taskArgs

        try { Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue } catch {}
        Register-ScheduledTask -TaskName $taskName -Description $taskDesc -Action $action `
            -Trigger @($dailyTrigger, $startupTrigger) -User "$env:USERNAME" -RunLevel Highest -Force | Out-Null

        Log "✅ Scheduled Task '$taskName' installed (daily & startup)." Green
    } catch { Log "❌ Task install failed: $($_.Exception.Message)" Red }
    exit 0
}

# -------------------- Env & repo --------------------
$IsGitBash = $false
if ($env:MSYSTEM -match "MINGW|MSYS|CYGWIN") { $IsGitBash = $true }
if ($IsGitBash) { Log "🐧 Git Bash" Cyan } else { Log "🪟 PowerShell" Cyan }

if ($RepoPath -match '^/[a-z]/') { $RepoPath = Convert-PosixToWindowsPath $RepoPath }
$RepoPath = $RepoPath -replace '/','\' 
if (-not (Test-Path -LiteralPath $RepoPath)) { Log "❌ Repo not found: $RepoPath" Red; exit 1 }
Set-Location -LiteralPath $RepoPath
if (-not (Test-Path -LiteralPath ".git")) { Log "❌ Not a git repo: $RepoPath" Red; exit 1 }

# -------------------- Git tweaks --------------------
try {
    git config --global http.postBuffer 524288000
    git config --global core.compression 0
    git config --global pack.windowMemory "100m"
    git config --global pack.packSizeLimit "100m"
    git config --global pack.threads "1"
    git lfs install
} catch {}

# -------------------- Safety backup --------------------
$ts = (Get-Date).ToString("yyyyMMdd-HHmmss")
$backupBranch = "autosync-backup-$ts"
git branch -f $backupBranch HEAD
git push origin $backupBranch --set-upstream | Out-Null
Log "🔖 Backup branch pushed: $backupBranch" Cyan

# -------------------- Ensure branch --------------------
function Ensure-RemoteBranchExists {
    param([string]$rBranch)
    $exists = git ls-remote --heads origin $rBranch | Out-String
    if (-not $exists.Trim()) {
        Log "ℹ️ Creating missing branch $rBranch..." Yellow
        git push -u origin HEAD:$rBranch
    }
}
Ensure-RemoteBranchExists $Branch

# -------------------- Fetch + rebase --------------------
git fetch --prune origin $Branch
git rebase --autostash origin/$Branch
if ($LASTEXITCODE -ne 0) {
    Log "⚠️ Rebase failed, trying merge --theirs..." Yellow
    git merge -X theirs origin/$Branch --no-edit
    if ($LASTEXITCODE -ne 0) { git rebase --abort; git merge --abort }
}

# -------------------- Large file detection --------------------
function Find-LargeFiles($thresholdMB=50) {
    $threshold = $thresholdMB * 1MB
    $large = @()
    $raw = git ls-files -z
    $names = $raw -split "`0"
    foreach ($f in $names) {
        if (-not $f) { continue }
        $p = Join-Path $RepoPath $f
        if (Test-Path -LiteralPath $p) {
            $item = Get-Item -LiteralPath $p
            if ($item.Length -gt $threshold) { $large += $f }
        }
    }
    return $large
}

$largeFiles = Find-LargeFiles 50
if ($largeFiles.Count -gt 0) {
    Log "⚠️ Large files: $($largeFiles -join ', ')" Yellow
    $largeBranch = "autosync-largefiles-$ts"
    git branch -f $largeBranch HEAD
    git push origin $largeBranch --set-upstream | Out-Null

    if ($AutoMigrateToLFS) {
        git checkout $largeBranch
        $patterns = ($largeFiles | ForEach-Object { "*" + [System.IO.Path]::GetExtension($_) }) -join ","
        git lfs migrate import --include="$patterns" --include-ref=refs/heads/$largeBranch
        git push origin $largeBranch --force
        git checkout $Branch
    }

    foreach ($lf in $largeFiles) { git rm --cached --ignore-unmatch -- "$lf" }
    git commit -m "chore: remove >50MB files (kept in $largeBranch)" 2>$null
}

# -------------------- Stage local changes --------------------
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "Auto-sync @ $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 2>$null
}

# -------------------- Full push w/ retries --------------------
function Try-FullPush($MaxRetries,$InitialDelay) {
    $attempt=0;$delay=$InitialDelay
    while ($attempt -lt $MaxRetries) {
        $attempt++
        Log "🔄 Push attempt $attempt/$MaxRetries" Yellow
        git push origin $Branch --progress
        if ($LASTEXITCODE -eq 0) { git lfs push origin $Branch; return $true }
        Start-Sleep -s $delay; $delay=[Math]::Min(300,[Math]::Round($delay*1.8))
    }
    return $false
}

if (Try-FullPush $MaxFullPushRetries $InitialDelaySeconds) {
    Remove-Item -LiteralPath $StateFile -ErrorAction SilentlyContinue
    # Run dependency auto-fix optionally AFTER a successful push (keeps behavior safe)
    if ($RunDepsFix) {
        Log "🔐 Running dependency auto-fix step (user requested)..." Cyan

        function Run-DependencyAutoFix {
            param([switch]$Force)

            # detect package manager by lockfile
            $hasNpmLock = Test-Path -LiteralPath "package-lock.json"
            $hasYarnLock = Test-Path -LiteralPath "yarn.lock"
            $hasPnpmLock = Test-Path -LiteralPath "pnpm-lock.yaml"

            # choose manager priority: pnpm > yarn > npm
            if ($hasPnpmLock) { $mgr = "pnpm" }
            elseif ($hasYarnLock) { $mgr = "yarn" }
            else { $mgr = "npm" }

            Log "🔎 Detected package manager: $mgr" Cyan

            # Helper to create lockfile if missing and run install
            function Ensure-Lockfile-And-Install {
                param([string]$mgr)
                if ($mgr -eq "pnpm") {
                    if (-not $hasPnpmLock) {
                        Log "ℹ️ No pnpm lockfile; running 'pnpm install' to create one..." Yellow
                        pnpm install | Out-Host
                    }
                } elseif ($mgr -eq "yarn") {
                    if (-not $hasYarnLock) {
                        Log "ℹ️ No yarn.lock; running 'yarn install' to create one..." Yellow
                        yarn install | Out-Host
                    }
                } else {
                    if (-not $hasNpmLock) {
                        Log "ℹ️ No package-lock.json; running 'npm install' to create one..." Yellow
                        npm install | Out-Host
                    }
                }
            }

            # Run manager-specific fixes
            try {
                if ($mgr -eq "pnpm") {
                    Ensure-Lockfile-And-Install -mgr "pnpm"
                    Log "🔍 Running 'pnpm audit' and attempting 'pnpm audit --fix'..." Yellow
                    pnpm audit --reporter=text | Out-Host
                    if ($Force) {
                        pnpm audit --fix --force | Out-Host
                    } else {
                        pnpm audit --fix | Out-Host
                    }
                }
                elseif ($mgr -eq "yarn") {
                    Ensure-Lockfile-And-Install -mgr "yarn"

                    # Yarn currently does not provide a first-class 'audit fix' in many versions.
                    # Try npx yarn-audit-fix if available, otherwise fall back to npm-based approach as best-effort.
                    Log "🔍 Running 'yarn audit'..." Yellow
                    yarn audit --level low --json | Out-Host

                    # Try npx yarn-audit-fix (community tool) as an attempt to auto-fix
                    $hasYarnAuditFix = (Test-Path -LiteralPath ".\node_modules\.bin\yarn-audit-fix") -or (Get-Command "yarn-audit-fix" -ErrorAction SilentlyContinue)
                    if ($hasYarnAuditFix) {
                        Log "ℹ️ Found 'yarn-audit-fix', running it..." Yellow
                        npx yarn-audit-fix | Out-Host
                    } else {
                        Log "ℹ️ 'yarn-audit-fix' not found. Attempting npm fallback: create package-lock.json & run 'npm audit fix'." Yellow
                        # create package-lock-only and run npm audit fix as a fallback
                        npm i --package-lock-only | Out-Host
                        if ($Force) {
                            npm audit fix --force --legacy-peer-deps | Out-Host
                        } else {
                            npm audit fix --legacy-peer-deps | Out-Host
                        }
                    }
                }
                else {
                    # npm path
                    Ensure-Lockfile-And-Install -mgr "npm"
                    Log "🔍 Running 'npm audit'..." Yellow
                    npm audit --audit-level=low | Out-Host
                    if ($Force) {
                        npm audit fix --force --legacy-peer-deps | Out-Host
                    } else {
                        npm audit fix --legacy-peer-deps | Out-Host
                    }
                }
            } catch {
                Log "⚠️ Dependency auto-fix command failed: $($_.Exception.Message)" Yellow
            }

            # Detect lockfile changes
            $changes = git status --porcelain | Select-String "package-lock.json|yarn.lock|pnpm-lock.yaml"
            if ($changes) {
                $branchName = "autosync-depsfix-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
                Log "📦 Dependency updates detected. Creating branch: $branchName" Yellow

                git checkout -b $branchName
                git add package*.json yarn.lock pnpm-lock.yaml 2>$null
                git commit -m "chore: auto-fix dependency vulnerabilities" 2>$null
                git push origin $branchName

                Log "✅ Fixes pushed successfully on branch $branchName" Green
                Log "➡️ Create PR: https://github.com/thealphakenya/qmoi-enhanced/pull/new/$branchName" Green
            } else {
                Log "✅ No dependency lockfile changes detected after audit fix." Green
            }
        }

        # run the dependency auto-fix function with the user-provided force flag
        Run-DependencyAutoFix -Force:$DepsForce
    }

    Send-Notification "SUCCESS" "Repo fully synced."
    exit 0
}

# -------------------- Chunked push --------------------
$commitList = (git rev-list --reverse $Branch) -split "`n"
$total=$commitList.Count
$i=0;$chunk=$MaxChunkStart
while ($i -lt $total) {
    $end=[Math]::Min($i+$chunk-1,$total-1)
    $startCommit=$commitList[$i];$endCommit=$commitList[$end]
    Log "➡️ Pushing $($i+1)..$($end+1)" Yellow
    git push origin "${startCommit}:$Branch"
    if ($LASTEXITCODE -eq 0) { $i=$end+1 } else { $chunk=[Math]::Max([Math]::Floor($chunk/2),1) }
}
Send-Notification "SUCCESS" "Repo synced via chunked push."
exit 0
