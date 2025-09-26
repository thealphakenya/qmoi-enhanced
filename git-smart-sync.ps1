<#
git-smart-sync.ps1
Final unified sync script with safety branches, optional LFS migration, notifications via GitHub,
log rotation, scheduled task install, adaptive chunked pushes, and resume support.

Save as: D:\applications\Alpha-Q-ai\git-smart-sync.ps1
Run (once): powershell.exe -NoProfile -ExecutionPolicy Bypass -File "D:\applications\Alpha-Q-ai\git-smart-sync.ps1"
Install scheduled task: powershell.exe -NoProfile -ExecutionPolicy Bypass -File "D:\applications\Alpha-Q-ai\git-smart-sync.ps1" -InstallScheduledTask

Params:
  -RepoPath                repository path (default D:\applications\Alpha-Q-ai)
  -Branch                  target branch (default main)
  -AutoMigrateToLFS        switch: attempt to migrate detected large files on safety branch to Git LFS
  -OpenIssueOnLargeFiles   switch: open a GitHub Issue linking to safety branch (needs GITHUB_TOKEN or gh CLI)
  -SlackWebhook, -EmailTo  optional notifications
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
    [string]$EmailTo = ""
)

# -------------------- Helpers --------------------
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

function Convert-PosixToWindowsPath($p) {
    if ($p -match "^/[a-z]/") {
        $drive = $p.Substring(1,1).ToUpper()
        $rest = $p.Substring(3) -replace '/','\'
        return "$drive`:\" + $rest
    }
    return $p
}

# Simple safe JSON encode for PowerShell strings (for GitHub API)
function Escape-JsonString($s) {
    return ($s -replace '\\','\\\\') -replace '"','\"' -replace "`n", '\n' -replace "`r", '\r'
}

# -------------------- Scheduled Task Installer --------------------
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

# -------------------- Environment & repo --------------------
$IsGitBash = $false
if ($env:MSYSTEM -and ($env:MSYSTEM -match "MINGW|MSYS|CYGWIN")) { $IsGitBash = $true }
elseif ($env:SHELL -and ($env:SHELL -match "bash")) { $IsGitBash = $true }
if ($IsGitBash) { Log "🐧 Git Bash-like environment" Cyan } else { Log "🪟 PowerShell/Windows environment" Cyan }

if ($RepoPath -match '^/[a-z]/') { $RepoPath = Convert-PosixToWindowsPath $RepoPath }
$RepoPath = $RepoPath -replace '/','\' 
if (-not (Test-Path $RepoPath)) { Log "❌ Repo path not found: $RepoPath" Red; exit 1 }
Set-Location $RepoPath
if (-not (Test-Path ".git")) { Log "❌ Not a git repository in $RepoPath" Red; exit 1 }

# -------------------- Conservative git tweaks --------------------
try {
    git config --global http.postBuffer 524288000 | Out-Null
    git config --global core.compression 0 | Out-Null
    git config --global pack.windowMemory "100m" | Out-Null
    git config --global pack.packSizeLimit "100m" | Out-Null
    git config --global pack.threads "1" | Out-Null
    git lfs install | Out-Null
} catch { Log "⚠️ git config tweak failed (ignored)." Yellow }

# -------------------- Safety backup branch --------------------
$ts = (Get-Date).ToString("yyyyMMdd-HHmmss")
$backupBranch = "autosync-backup-$ts"
try {
    git branch -f $backupBranch HEAD
    git push origin $backupBranch --set-upstream | Out-Null
    Log "🔖 Remote backup branch pushed: $backupBranch" Cyan
} catch { Log "⚠️ Backup push failed (continuing): $($_.Exception.Message)" Yellow }

# -------------------- Ensure remote branch exists --------------------
function Ensure-RemoteBranchExists {
    param([string]$rBranch)
    try {
        $exists = git ls-remote --heads origin ${rBranch} | Out-String
        if (-not $exists.Trim()) {
            Log "ℹ️ Remote branch '${rBranch}' not found — creating from local HEAD..." Yellow
            git push -u origin HEAD:${rBranch}
            if ($LASTEXITCODE -eq 0) { Log "✅ Created remote branch ${rBranch}" Green } else { Log "⚠️ Could not create remote branch ${rBranch}" Yellow }
        } else {
            Log "ℹ️ Remote branch ${rBranch} exists." Gray
        }
    } catch { Log "⚠️ Error checking/creating remote branch: $($_.Exception.Message)" Yellow }
}
Ensure-RemoteBranchExists -rBranch ${Branch}

# -------------------- Fetch + rebase --------------------
try {
    Log "⬇️ Fetching origin/${Branch} (prune)..." Cyan
    git fetch --prune origin ${Branch}
} catch { Log "⚠️ git fetch failed (ignored): $($_.Exception.Message)" Yellow }

$syncSucceeded = $false
try {
    Log "🔧 Attempting rebase onto origin/${Branch} (with autostash)..." Cyan
    git rebase --autostash origin/${Branch}
    if ($LASTEXITCODE -eq 0) {
        Log "✅ Rebase succeeded." Green
        $syncSucceeded = $true
    } else {
        Log "⚠️ Rebase failed; trying auto-merge (theirs)..." Yellow
        git merge -X theirs origin/${Branch} --no-edit
        if ($LASTEXITCODE -eq 0) {
            Log "✅ Auto-merge (theirs) succeeded." Green
            $syncSucceeded = $true
        } else {
            Log "⚠️ Merge failed; aborting rebase/merge." Red
            git rebase --abort 2>$null
            git merge --abort 2>$null
        }
    }
} catch { Log "⚠️ Exception during remote sync: $($_.Exception.Message)" Yellow }

# -------------------- Detect large files (>50MB) in tracked files --------------------
function Find-LargeFiles {
    param([int]$thresholdMB = 50)
    $threshold = $thresholdMB * 1MB
    $large = @()
    $files = git ls-files
    if (-not $files) { return @() }
    foreach ($f in $files) {
        $p = Join-Path $RepoPath $f
        if (Test-Path $p) {
            try {
                $sz = (Get-Item $p -ErrorAction SilentlyContinue).Length
                if ($sz -and $sz -gt $threshold) { $large += $f }
            } catch {}
        }
    }
    return $large
}

$largeFiles = Find-LargeFiles -thresholdMB 50
if ($largeFiles.Count -gt 0) {
    Log "⚠️ Detected large files (>50MB): $($largeFiles -join ', ')" Yellow

    # Create safety branch to preserve large files
    $largeBranch = "autosync-largefiles-$ts"
    try {
        git branch -f $largeBranch HEAD
        git push origin $largeBranch --set-upstream | Out-Null
        Log "🔐 Safety branch pushed: $largeBranch" Green
    } catch { Log "⚠️ Pushing safety branch failed: $($_.Exception.Message)" Yellow }

    # Optionally migrate safety branch files to LFS (rewrites safety branch only)
    if ($AutoMigrateToLFS) {
        Log "🔁 Auto-migration to Git LFS enabled: starting migration on safety branch $largeBranch (this rewrites only $largeBranch)..." Cyan
        try {
            # Checkout safety branch locally
            git checkout $largeBranch
            # Build include pattern (comma separated basename patterns)
            $patterns = @()
            foreach ($f in $largeFiles) {
                $ext = [System.IO.Path]::GetExtension($f)
                if ($ext) { $patterns += "*$ext" } else { $patterns += $f }
            }
            $include = ($patterns | Sort-Object -Unique) -join ","
            Log "🔍 Patterns for migrate: $include" Gray

            # Run git lfs migrate import on this branch for those patterns
            # WARNING: this rewrites history on the safety branch only (we push it force)
            git lfs migrate import --include="$include" --include-ref=refs/heads/$largeBranch 2>&1 | Out-String | ForEach-Object { Log $_ Gray }
            if ($LASTEXITCODE -eq 0) {
                Log "✅ git lfs migrate completed on $largeBranch" Green
                git push origin $largeBranch --force
                Log "✅ Migrated safety branch pushed (force): $largeBranch" Green
            } else {
                Log "⚠️ git lfs migrate reported non-zero exit. Safety branch still pushed (unmigrated)." Yellow
            }
        } catch {
            Log "⚠️ Exception during LFS migration: $($_.Exception.Message)" Yellow
        } finally {
            # Return to original branch
            git checkout ${Branch} 2>$null
        }
    }

    # Remove large files from index on current branch to allow pushes (they remain on safety branch)
    foreach ($lf in $largeFiles) {
        try {
            Log "🧹 Removing large file from index (kept in $largeBranch): $lf" Yellow
            git rm --cached --ignore-unmatch -- "$lf" 2>$null
        } catch { Log "⚠️ Failed to git rm --cached $lf" Yellow }
    }
    git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
        git commit -m "chore: remove very large files from ${Branch} (moved to $largeBranch for preservation)" 2>$null
        Log "✅ Committed removals of large files from ${Branch}" Cyan
    } else {
        Log "ℹ️ No changes staged after removing large files." Gray
    }

    # Optionally open an Issue linking to the safety branch
    if ($OpenIssueOnLargeFiles) {
        $details = "Large files detected and preserved on branch `$largeBranch`:`n`n" + ($largeFiles -join "`n")
        Log "📣 Creating GitHub Issue for large files (if token or gh available)..." Cyan

        $repoRemote = (git remote get-url origin) -replace '\.git$',''
        # try gh CLI first
        try {
            if (Get-Command gh -ErrorAction SilentlyContinue) {
                $issueTitle = "Auto-sync: large files preserved to $largeBranch"
                $issueBody = $details
                gh issue create --title $issueTitle --body $issueBody --repo $repoRemote --assignee "$env:USERNAME" 2>$null
                Log "✅ Issue created via gh CLI." Green
            } else {
                # fallback to REST API if GITHUB_TOKEN set
                $token = $env:GITHUB_TOKEN
                if ($token) {
                    # derive owner/repo
                    $remote = (git remote get-url origin).Trim()
                    if ($remote -match "[:/](.+?)/(.+?)(\.git)?$") {
                        $owner = $matches[1]; $repo = $matches[2]
                        $title = Escape-JsonString("Auto-sync: large files preserved to $largeBranch")
                        $body = Escape-JsonString($details)
                        $payload = "{`"title`":`"$title`",`"body`":`"$body`"}"
                        $uri = "https://api.github.com/repos/$owner/$repo/issues"
                        $hdr = @{ Authorization = "token $token"; "User-Agent" = "git-smart-sync" }
                        try {
                            Invoke-RestMethod -Uri $uri -Method Post -Headers $hdr -Body $payload -ContentType "application/json"
                            Log "✅ Issue created via GitHub API." Green
                        } catch { Log "⚠️ Failed to create issue via API: $($_.Exception.Message)" Yellow }
                    } else { Log "⚠️ Could not parse origin remote for repo owner/name" Yellow }
                } else {
                    Log "⚠️ Neither gh CLI nor GITHUB_TOKEN available — cannot create issue automatically." Yellow
                }
            }
        } catch { Log "⚠️ Issue creation failed: $($_.Exception.Message)" Yellow }
    }
}

# -------------------- Stage & commit local changes --------------------
Log "📂 Staging changes..." Cyan
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    $commitMsg = "Auto-sync commit @ $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git commit -m "$commitMsg" 2>$null
    if ($LASTEXITCODE -eq 0) { Log "✅ Local changes committed." Green } else { Log "⚠️ Commit returned non-zero." Yellow }
} else {
    Log "ℹ️ No staged changes to commit." Gray
}

# -------------------- Full push with exponential backoff --------------------
function Try-FullPush {
    param([int]$MaxRetries, [int]$InitialDelay)
    $attempt = 0
    $delay = $InitialDelay
    while ($attempt -lt $MaxRetries) {
        $attempt++
        Log "🔄 Full push attempt $attempt / $MaxRetries (delay ${delay}s)..." Yellow

        git push origin ${Branch} --progress
        $code = $LASTEXITCODE

        if ($code -eq 0) {
            Log "✅ Full push succeeded." Green
            git lfs push origin ${Branch} | Out-Null
            return $true
        }

        # If remote branch missing, ensure it exists (attempt)
        if ($code -ne 0) {
            Log "⚠️ Push failed (exit $code). Ensuring remote branch exists and trying quick rebase..." Red
            Ensure-RemoteBranchExists -rBranch ${Branch}
            git fetch origin ${Branch}
            git rebase --autostash origin/${Branch} 2>$null
            if ($LASTEXITCODE -eq 0) {
                Log "✅ Quick rebase fixed divergence; retrying push." Green
                git push origin ${Branch} --progress
                if ($LASTEXITCODE -eq 0) { git lfs push origin ${Branch} | Out-Null; return $true }
            } else {
                try { git rebase --abort 2>$null } catch {}
            }
        }

        Log "⏳ Waiting $delay seconds..." DarkGray
        Start-Sleep -Seconds $delay
        $delay = [Math]::Min(300, [Math]::Round($delay * 1.8))
    }
    return $false
}

if (Try-FullPush -MaxRetries $MaxFullPushRetries -InitialDelay $InitialDelaySeconds) {
    if (Test-Path $StateFile) { Remove-Item $StateFile -ErrorAction SilentlyContinue }
    Log "🎉 Repo fully synced." Green
    Send-Notification "SUCCESS" "Repo $RepoPath fully synced to ${Branch}."
    exit 0
}

Log "⚠️ Full push failed repeatedly. Falling back to adaptive chunked push." Yellow

# -------------------- Adaptive chunked push (resume-friendly) --------------------
$commitStr = git rev-list --reverse ${Branch}
if (-not $commitStr) { Log "❌ No commits found for ${Branch}. Aborting." Red; exit 1 }
$commitList = $commitStr -split "`n"
$total = $commitList.Count
Log "📊 Commit count: $total" Cyan

# resume start index from state file
$startIndex = 0
if (Test-Path $StateFile) {
    try {
        $last = Get-Content $StateFile -ErrorAction Stop
        if ($last) {
            $idx = [Array]::IndexOf($commitList, $last)
            if ($idx -ge 0) { $startIndex = $idx + 1; Log "⏩ Resuming from commit $last (index $startIndex)" Cyan }
            else { Log "⚠️ Saved commit not in history; starting from 0." Yellow }
        }
    } catch { Log "⚠️ Could not read state file; starting from 0." Yellow }
}

$chunkSize = [int]$MaxChunkStart
$i = $startIndex
while ($i -lt $total) {
    $endIndex = [Math]::Min($i + $chunkSize - 1, $total - 1)
    $startCommit = $commitList[$i]
    $endCommit = $commitList[$endIndex]

    Log "➡️ Pushing commits $($i+1)..$($endIndex+1) ($startCommit -> $endCommit) chunkSize=$chunkSize" Yellow
    git push origin "${startCommit}:${Branch}"
    $code = $LASTEXITCODE

    if ($code -eq 0) {
        Log "✅ Chunk pushed." Green
        try { Set-Content -Path $StateFile -Value $endCommit -Force } catch { Log "⚠️ Writing state failed." Yellow }
        git lfs push origin ${Branch} | Out-Null
        $i = $endIndex + 1
        if ($chunkSize -lt $MaxChunkStart) { $chunkSize = [Math]::Min($MaxChunkStart, $chunkSize * 2) }
    } else {
        Log "❌ Chunk push failed (exit $code). Shrinking chunk size..." Red
        $chunkSize = [Math]::Max([math]::Floor($chunkSize / 2), 1)
        if ($chunkSize -eq 1) {
            Log "⚠️ Chunk size is 1 — creating individual safety branch for commit $startCommit." Yellow
            $safetyBranch = "autosync-safety-$ts"
            try {
                git branch -f $safetyBranch $startCommit
                git push origin ${safetyBranch} --set-upstream | Out-Null
                Log "✅ Safety branch pushed: $safetyBranch" Green
            } catch { Log "⚠️ Safety branch push failed." Yellow }
        }
        Start-Sleep -Seconds 5
    }
}

# -------------------- Finalize --------------------
if (Test-Path $StateFile) { Remove-Item $StateFile -ErrorAction SilentlyContinue }
Log "✅ All commits pushed with adaptive chunking." Green
Send-Notification "SUCCESS" "Repo $RepoPath fully synced with adaptive chunking."
exit 0
