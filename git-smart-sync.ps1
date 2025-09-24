function Invoke-GitAutoRebase {
    param(
        [string]$Branch = "main",
        [string]$Remote = "origin"
    )

    Write-Host "Starting automated rebase workflow on $Remote/$Branch..."

    # 1. Abort any half-done rebase (ignore errors if none in progress)
    git rebase --abort 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "No rebase in progress"
    }

    # 2. Stash local changes (tracked + untracked)
    git add .
    git stash push -u -m "temp-rebase-stash" | Out-Null

    # 3. Fetch latest from remote
    git fetch $Remote

    # 4. Hard reset branch to remote
    git reset --hard "$Remote/$Branch"

    # 5. Reapply local work
    git stash pop | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Nothing to reapply"
    }

    # 6. Auto-resolve yarn.lock conflicts
    if (Test-Path "yarn.lock") {
        git add yarn.lock   # keep local yarn.lock
    } else {
        git rm --cached yarn.lock 2>$null   # accept remote deletion if applicable
    }

    # 7. Stage everything else
    git add -A

    # 8. Commit if there are staged changes
    $diff = git diff --cached --name-only
    if ($diff) {
        git commit -m "Automated rebase & apply local changes"
    } else {
        Write-Host "No changes to commit"
    }

    # 9. Force push with lease
    git push $Remote $Branch --force-with-lease

    Write-Host "Automated rebase complete!"
}
