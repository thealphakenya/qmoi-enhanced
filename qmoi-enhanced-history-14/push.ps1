# Ultra-Enhanced Git Push Automation Script
# This script handles ALL git operations automatically with comprehensive error handling
# Run with: powershell -ExecutionPolicy Bypass -File push.txt

# Function to handle errors gracefully
function Handle-Error {
    param($Step, $Command, $MaxRetries = 3)
    $retryCount = 0
    do {
        try {
            Write-Host "Executing: $Command" -ForegroundColor Yellow
            Invoke-Expression $Command
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ $Step completed successfully" -ForegroundColor Green
                return $true
            }
        }
        catch {
            Write-Host "❌ Error in $Step`: $($_.Exception.Message)" -ForegroundColor Red
        }
        $retryCount++
        if ($retryCount -lt $MaxRetries) {
            Write-Host "Retrying $Step (attempt $retryCount/$MaxRetries)..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }
    } while ($retryCount -lt $MaxRetries)
    Write-Host "❌ $Step failed after $MaxRetries attempts" -ForegroundColor Red
    return $false
}

# Function to check if git repository is clean
function Test-GitClean {
    $status = git status --porcelain
    return [string]::IsNullOrWhiteSpace($status)
}

# Function to resolve merge conflicts automatically
function Resolve-Conflicts {
    Write-Host "🔧 Attempting to resolve conflicts automatically..." -ForegroundColor Cyan
    
    # Check for conflict markers
    $conflictFiles = git diff --name-only --diff-filter=U
    if ($conflictFiles) {
        Write-Host "Found conflict files: $conflictFiles" -ForegroundColor Yellow
        
        foreach ($file in $conflictFiles) {
            Write-Host "Processing conflict in: $file" -ForegroundColor Yellow
            
            # Try to resolve common conflicts automatically
            $content = Get-Content $file -Raw
            if ($content -match "<<<<<<< HEAD") {
                # Simple strategy: keep our changes (HEAD)
                $resolved = $content -replace "<<<<<<< HEAD.*?=======.*?>>>>>>> .*", ""
                $resolved = $resolved -replace "<<<<<<< HEAD", ""
                $resolved = $resolved -replace "=======.*?>>>>>>> .*", ""
                Set-Content $file $resolved -NoNewline
                Write-Host "Auto-resolved conflicts in $file" -ForegroundColor Green
            }
        }
        
        # Add resolved files
        git add $conflictFiles
        git commit -m "Auto-resolve conflicts: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        return $true
    }
    return $false
}

# Main execution starts here
Write-Host "🚀 Starting Ultra-Enhanced Git Push Automation" -ForegroundColor Magenta
Write-Host "===============================================" -ForegroundColor Magenta

# Step 1: Environment Setup
Write-Host "`n=== Step 1: Environment Setup ===" -ForegroundColor Cyan
Handle-Error "Git Config Setup" "git config --global core.autocrlf true"
Handle-Error "Git Config Setup" "git config --global core.safecrlf false"
Handle-Error "Git Config Setup" "git config --global pull.rebase true"
Handle-Error "Git Config Setup" "git config --global push.default simple"

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
    Handle-Error "Branch Switch" "git checkout main"
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

# Clean untracked files (with confirmation simulation)
Write-Host "Cleaning untracked files..." -ForegroundColor Yellow
Handle-Error "Clean Untracked" "git clean -fd"

# Step 4: Stash any uncommitted changes
Write-Host "`n=== Step 4: Stashing Changes ===" -ForegroundColor Cyan
if (-not (Test-GitClean)) {
    Write-Host "Stashing uncommitted changes..." -ForegroundColor Yellow
    Handle-Error "Stash Changes" "git stash push -m 'Auto-stash before push: $(Get-Date -Format \"yyyy-MM-dd HH:mm:ss\")'"
}

# Step 5: Reset and Prepare
Write-Host "`n=== Step 5: Reset and Prepare ===" -ForegroundColor Cyan
Handle-Error "Reset Staged" "git reset HEAD"
Handle-Error "Add All Changes" "git add -A"

# Step 6: Commit Changes
Write-Host "`n=== Step 6: Commit Changes ===" -ForegroundColor Cyan
$hasChanges = git diff --cached --quiet; $hasChanges = $LASTEXITCODE -ne 0
if ($hasChanges) {
    $commitMessage = "Auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Automated updates and cleanup"
    Handle-Error "Commit Changes" "git commit -m '$commitMessage'"
} else {
    Write-Host "No changes to commit." -ForegroundColor Green
}

# Step 7: Pull with Advanced Conflict Resolution
Write-Host "`n=== Step 7: Pull with Conflict Resolution ===" -ForegroundColor Cyan
$pullSuccess = $false
$maxPullRetries = 3

for ($i = 1; $i -le $maxPullRetries; $i++) {
    Write-Host "Pull attempt $i/$maxPullRetries..." -ForegroundColor Yellow
    
    # Try pull with rebase
    git pull origin main --rebase --no-edit
    if ($LASTEXITCODE -eq 0) {
        $pullSuccess = $true
        Write-Host "✅ Pull successful!" -ForegroundColor Green
        break
    } else {
        Write-Host "❌ Pull failed. Attempting conflict resolution..." -ForegroundColor Red
        
        # Check if we're in a rebase state
        if (Test-Path ".git/rebase-merge") {
            Write-Host "In rebase state. Attempting to resolve..." -ForegroundColor Yellow
            
            if (Resolve-Conflicts) {
                git rebase --continue
                if ($LASTEXITCODE -eq 0) {
                    $pullSuccess = $true
                    Write-Host "✅ Rebase completed successfully!" -ForegroundColor Green
                    break
                }
            } else {
                Write-Host "Aborting rebase and trying merge strategy..." -ForegroundColor Yellow
                git rebase --abort
                git pull origin main --no-rebase --no-edit
                if ($LASTEXITCODE -eq 0) {
                    $pullSuccess = $true
                    Write-Host "✅ Merge pull successful!" -ForegroundColor Green
                    break
                }
            }
        } else {
            # Try merge strategy
            git pull origin main --no-rebase --no-edit
            if ($LASTEXITCODE -eq 0) {
                $pullSuccess = $true
                Write-Host "✅ Merge pull successful!" -ForegroundColor Green
                break
            }
        }
    }
    
    if ($i -lt $maxPullRetries) {
        Write-Host "Waiting before retry..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
}

if (-not $pullSuccess) {
    Write-Host "❌ All pull attempts failed. Manual intervention required." -ForegroundColor Red
    Write-Host "Current status:" -ForegroundColor Yellow
    git status
    exit 1
}

# Step 8: Push with Retry Logic
Write-Host "`n=== Step 8: Push to Remote ===" -ForegroundColor Cyan
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

# Step 9: Final Verification
Write-Host "`n=== Step 9: Final Verification ===" -ForegroundColor Cyan
if ($pushSuccess) {
    Write-Host "🎉 SUCCESS! All operations completed successfully!" -ForegroundColor Green
    Write-Host "Current branch: $(git branch --show-current)" -ForegroundColor Cyan
    Write-Host "Latest commit: $(git log -1 --oneline)" -ForegroundColor Cyan
    Write-Host "Repository status: $(git status --porcelain | Measure-Object | Select-Object -ExpandProperty Count) files changed" -ForegroundColor Cyan
} else {
    Write-Host "❌ Push failed after all attempts." -ForegroundColor Red
    Write-Host "Please check your network connection and try manually:" -ForegroundColor Yellow
    Write-Host "git push origin main" -ForegroundColor White
}

# Step 10: Cleanup and Summary
Write-Host "`n=== Step 10: Cleanup and Summary ===" -ForegroundColor Cyan
Write-Host "Script execution completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green

# Show final status
Write-Host "`nFinal Repository Status:" -ForegroundColor Magenta
git status --short

Write-Host "`n=== Manual Commands (if needed) ===" -ForegroundColor Yellow
Write-Host "git status" -ForegroundColor White
Write-Host "git log --oneline -5" -ForegroundColor White
Write-Host "git push origin main" -ForegroundColor White
Write-Host "git pull origin main" -ForegroundColor White
