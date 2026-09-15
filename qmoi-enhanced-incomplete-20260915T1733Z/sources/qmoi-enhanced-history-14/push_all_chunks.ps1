# push_all_chunks.ps1
# Fully autonomous resumable push script with adaptive chunking + LFS support + logging.

# ------------ configuration ------------
$commitsFile = ".\clean_commits.txt"
$resumeFile = ".\resume_state.txt"
$logFile = ".\push_log.txt"

# Starting chunk size. Tune down if you still fail a lot.
$initialChunkSize = 100

# Minimum chunk size to try before single-commit fallback
$minChunkSize = 1

# If $true script will retry forever on a failing chunk (with backoff).
# If $false script gives up after $maxAttempts attempts per chunk.
$infiniteRetry = $true

# Base attempts before shrinking chunk or failing (if infiniteRetry - it will keep trying)
$maxAttemptsBeforeShrink = 3

# initial wait between attempts (seconds) - exponential backoff will multiply this
$initialBackoffSeconds = 15

# Pause after a successful chunk
$postSuccessPause = 5

# Max backoff seconds
$maxBackoffSeconds = 300

# ------------- helpers & logging -------------
function Log($msg) {
    $time = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $line = "$time`t$msg"
    $line | Tee-Object -FilePath $logFile -Append
    Write-Host $msg
}

function Exec($cmd) {
    # Runs the command string (or array) and returns $LASTEXITCODE
    & $cmd
    return $LASTEXITCODE
}

# ------------- prepare -------------
if (-not (Test-Path $commitsFile)) {
    Log "ERROR: commits file not found: $commitsFile"
    exit 1
}

$commits = Get-Content $commitsFile
if ($commits.Count -eq 0) {
    Log "ERROR: commits file is empty."
    exit 1
}

# Ensure remote is HTTPS to avoid SSH port 22 timeouts issues
try {
    $remoteUrl = (git remote get-url origin) 2>&1
} catch {
    Log "ERROR: git not available or no remote origin. $_"
    exit 1
}
if ($remoteUrl -like "git@github.com:*") {
    $httpsUrl = $remoteUrl -replace "git@github.com:", "https://github.com/"
    git remote set-url origin $httpsUrl
    Log "Remote switched to HTTPS: $httpsUrl"
} else {
    Log "Remote already HTTPS or non-SSH: $remoteUrl"
}

# Check LFS availability
$hasLFS = $false
try {
    $lfsVersion = git lfs version 2>&1
    if ($LASTEXITCODE -eq 0) { $hasLFS = $true; Log "Git LFS detected: $lfsVersion" }
} catch {
    Log "Git LFS not detected."
}

# Load resume index
if (Test-Path $resumeFile) {
    $startIndex = [int](Get-Content $resumeFile)
    Log "Resuming from index $startIndex"
} else {
    $startIndex = 0
    Log "Starting fresh from index 0"
}

$chunkSize = $initialChunkSize

# ------------- push logic -------------
function Push-EndCommit($endCommit, $attempt, $backoffSeconds) {
    # Push LFS objects for that ref first (if available)
    if ($hasLFS) {
        Log " -> Pushing LFS objects for commit $endCommit (attempt $attempt)"
        # try to push LFS for that commit (git lfs push origin <ref>)
        git lfs push origin $endCommit 2>&1 | Tee-Object -FilePath $logFile -Append
        if ($LASTEXITCODE -ne 0) {
            Log "   LFS push returned exit code $LASTEXITCODE (continuing; might be fine)"
        }
    }

    Log " -> Pushing branch to commit $endCommit (attempt $attempt)"
    # Ensure we quote the refspec correctly. Use the single string argument for refspec.
    git push origin "$($endCommit):refs/heads/main" --force 2>&1 | Tee-Object -FilePath $logFile -Append
    return $LASTEXITCODE
}

$total = $commits.Count
$i = $startIndex

while ($i -lt $total) {
    $endIndex = [Math]::Min($i + $chunkSize - 1, $total - 1)
    $endCommit = $commits[$endIndex]

    Log "==== Chunk attempt: index range $i..$endIndex (endCommit=$endCommit) - chunkSize=$chunkSize ===="

    $attempt = 0
    $backoff = $initialBackoffSeconds
    $chunkSucceeded = $false

    while (-not $chunkSucceeded) {
        $attempt += 1

        $exit = Push-EndCommit $endCommit $attempt $backoff

        if ($exit -eq 0) {
            # success
            $chunkSucceeded = $true
            Set-Content $resumeFile $endIndex
            Log "✅ Chunk success. Progress saved (last pushed index: $endIndex)"
            $i = $endIndex + 1
            Start-Sleep -Seconds $postSuccessPause
            # if chunk succeeded and we previously shrank chunk, consider slowly increasing but not necessary
            break
        } else {
            Log "⚠️ Chunk push failed (exit code $exit)."

            if ($infiniteRetry) {
                # exponential backoff, then retry indefinitely (or until chunk size shrinks)
                Log "   Infinite-retry mode: will wait $backoff seconds then retry."
                Start-Sleep -Seconds $backoff
                $backoff = [Math]::Min($backoff * 2, $maxBackoffSeconds)
                continue
            } else {
                if ($attempt -lt $maxAttemptsBeforeShrink) {
                    Log "   Will retry (attempt $attempt of $maxAttemptsBeforeShrink) after $backoff seconds..."
                    Start-Sleep -Seconds $backoff
                    $backoff = [Math]::Min($backoff * 2, $maxBackoffSeconds)
                    continue
                } else {
                    # reached attempt limit for this chunk without success
                    Log "   Reached $maxAttemptsBeforeShrink attempts for this chunk without success."
                }
            }

            # fall through to chunk reduction logic (if not infiniteRetry or if we choose to reduce)
            break
        }
    }

    if (-not $chunkSucceeded) {
        # reduce chunk size if possible
        if ($chunkSize -gt $minChunkSize) {
            $newChunk = [Math]::Max([Math]::Floor($chunkSize / 2), $minChunkSize)
            if ($newChunk -eq $chunkSize) {
                # already at minimum: will fallback to single-commit push below
                Log "⚠️ Chunk size already at minimum $chunkSize. Will fallback to single-commit mode for this range."
            } else {
                Log "⚠️ Reducing chunk size from $chunkSize to $newChunk and retrying chunk."
                $chunkSize = $newChunk
                # loop continues while keeping $i unchanged so we retry smaller chunk
                continue
            }
        }

        # If we've reached here, chunkSize == minChunkSize (1) or we couldn't reduce further.
        # Fall back to pushing one commit at a time for the next block.
        Log "⚠️ Falling back to single-commit push mode starting at index $i."

        for ($j = $i; $j -lt $total; $j++) {
            $commit = $commits[$j]
            $singleAttempt = 0
            $singleBackoff = $initialBackoffSeconds
            $pushed = $false

            while (-not $pushed) {
                $singleAttempt += 1
                Log " -> Pushing single commit ($j): $commit (attempt $singleAttempt)"
                $exitSingle = Push-EndCommit $commit $singleAttempt $singleBackoff

                if ($exitSingle -eq 0) {
                    Set-Content $resumeFile $j
                    Log "   ✅ Single commit pushed and saved (index $j)."
                    $pushed = $true
                    Start-Sleep -Seconds 1
                    continue
                } else {
                    Log "   ⚠️ Single commit push failed (exit code $exitSingle)."

                    if ($infiniteRetry) {
                        Log "   Infinite-retry: waiting $singleBackoff seconds before retry."
                        Start-Sleep -Seconds $singleBackoff
                        $singleBackoff = [Math]::Min($singleBackoff * 2, $maxBackoffSeconds)
                        continue
                    } else {
                        if ($singleAttempt -lt $maxAttemptsBeforeShrink) {
                            Log "   Will retry single commit after $singleBackoff seconds..."
                            Start-Sleep -Seconds $singleBackoff
                            $singleBackoff = [Math]::Min($singleBackoff * 2, $maxBackoffSeconds)
                            continue
                        } else {
                            Log "   ❌ Giving up on single commit $j after $singleAttempt attempts."
                            Log "   Exiting; last saved index: $(if (Test-Path $resumeFile) { Get-Content $resumeFile } else { 'none' })"
                            exit 1
                        }
                    }
                }
            } # end single commit loop
        } # end single-commit for loop

        # if we reach here, single-commit loop finished (all remaining commits pushed)
        break
    } # end not chunkSucceeded branch

    # optionally: increase chunk size slowly on stable networks (not implemented by default)
} # end while over commits

Log "🎉 Finished run. Last saved index: $(if (Test-Path $resumeFile) { Get-Content $resumeFile } else { 'none' })"
