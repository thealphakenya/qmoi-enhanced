# SYNC.md - Repository Synchronization Guide

## Overview
This document details the synchronization mechanisms between the **qmoi-enhanced** repository and the **Alpha-Q-ai** repository. Both repositories are designed to work in full autonomy while maintaining bidirectional synchronization of critical files, features, and configurations.

## Repository Information

### qmoi-enhanced
- **Owner**: thealphakenya
- **URL**: https://github.com/thealphakenya/qmoi-enhanced
- **Primary Branches**: main, autosync-backup
- **Purpose**: QMOI AI applications UI, core features, and user-facing components
- **Contains**: Applications (qmoiaiui, qmoi-space, qcity, qalpha), styles, UI features

### Alpha-Q-ai
- **Owner**: thealphakenya
- **URL**: https://github.com/thealphakenya/Alpha-Q-ai
- **Primary Branches**: main, autosync-backup
- **Purpose**: Backend infrastructure, APIs, core algorithms, and cross-cutting concerns
- **Contains**: API implementations, endpoints, routes, backend services

## Synchronization Strategy

The remote historical branch `codespace-potential-space-happiness-wrv69x5j6qjq2g7wp`
is an auditable source snapshot. Before importing anything, automation must
enumerate its reachable files and commits, compare checksums against both
repositories, classify each path as QE-only, AQ-only, shared, or obsolete, and
create a reviewable sync PR. It must never overwrite current `main` implicitly.
Missing files are included through the PR when classification and validation
agree; conflicts remain blocked for review.

### Bidirectional Sync Model
Both repositories maintain:
1. **Main Branch**: Production-ready code with validated features
2. **Autosync-Backup Branch**: Automated backup and staging branch

### Master File Sync
The following critical files are synced bidirectionally:

#### API & Endpoints
- **API.md**: All APIs from both repositories
- **ENDPOINTS.md**: All endpoints from both repositories
- **ROUTES.md**: All routes from both repositories
- **MODELEVOLUTIONO.md**: The model evolution and countdown tracking file used by both repos

#### Architecture & Structure
- **ALLMDFILESREFS.md**: Reference of all .md files in both repos
- **TREE_FULL_STRUCTURE.md**: Complete directory structure
- **ALLPLATFORMSDEVICE.md**: Cross-platform device support

#### Features & Specifications
- **STYLES.md**: Unified UI styles with user-specific customization
- **UNIVERSALS.md**: Features available across all platforms
- **ALLAUTO.md**: All automation features
- **AUTODEV.md**: Auto-development capabilities

#### Applications
- **QMOIAI.md**: QMOI AI app specifications
- **QCITY.md**: File manager specifications
- **QMOI-SPACE.md**: Media player specifications
- **QALPHA.md**: IDE specifications

#### Accountability & Governance
- **ACCOUNTABILITY.md**: Master accountability tracking
- **QMOI_MODEL_CARD.md**: Model information card
- **QMOI_REALTIME_MEMORY_INDEX.md**: Real-time memory index

## Synchronization Workflows

### GitHub Actions Workflows in Both Repos
1. **branch-sync.yml**: Keeps main and autosync-backup branches in sync
2. **auto-merge-automated-pr.yml**: Automatically merges validated PRs
3. **ollama-autonomous-agent.yml**: Runs agent for autonomous validation
4. **ollama-pr-validation.yml**: Validates PRs against specifications

### Automatic Sync Triggers
- **On Push to Main**: Auto-sync critical files to sister repo
- **On PR Merge**: Validate and sync features between repos
- **Scheduled Daily**: Full sync check and reconciliation
- **On File Update**: Real-time sync for critical documentation files

All sync jobs use a single-writer rule per repository, `autosync-backup` as the
first publication target, `[sync]` commit markers, and `[skip ci]` only for the
resulting synchronization commit. This prevents push-trigger recursion and
competing Ollama servers. The agent records branch, file inventory, checksums,
authors, timestamps, and conflict decisions in `MERGE.md` and
`ollamatracks/SYNC_STATUS.txt`.

## File Distribution Strategy

### Files in qmoi-enhanced Only
- Application UI implementations (React, TypeScript, etc.)
- User interface styles and themes
- Desktop/Mobile app packages
- Client-side libraries
- User documentation

### Files in Alpha-Q-ai Only
- Backend API implementations
- Database schemas and migrations
- Server-side algorithms
- Microservices configurations
- Cloud infrastructure as code

### Files in BOTH Repositories
- API specifications (API.md, ENDPOINTS.md, ROUTES.md)
- Cross-cutting concerns
- Shared protocols and interfaces
- Model cards and specifications
- Accountability and governance documents

## Sync Process Flow

### Step 1: Change Detection
Agent detects changes in either repository:
- File modifications
- New files
- Deleted files
- Configuration changes

### Step 2: Classification
Agent classifies changes:
- **Repo-Specific**: Stays in source repo
- **Shared**: Needs replication to other repo
- **Critical**: Requires immediate sync
- **Scheduled**: Queued for next sync cycle

### Step 3: Validation
Before sync:
- Syntax validation
- Conflict detection
- Integrity checks
- Security scanning

### Step 4: Merge
Apply changes to target repository:
- Create sync branch
- Merge changes
- Resolve conflicts intelligently
- Update related files

### Step 5: Commit & Push
Finalize sync:
- Commit with "[sync]" label
- Push to autosync-backup first
- Validate in backup branch
- Merge to main on success

## Token Policy
- **Primary Token**: MY_CUSTOM_TOKEN (GitHub Personal Access Token)
- **Fallback**: GitHub token via `gh auth token`
- **Scope**: Full repo access for both repositories
- **Security**: Token never logged or exposed in output

## Conflict Resolution

### Strategy
1. **File-level conflicts**: Keep both versions, mark for manual review
2. **Merge conflicts**: Use intelligent merge considering both repo contexts
3. **Feature conflicts**: Parent feature wins, child feature marked for review
4. **API conflicts**: Version-aware merge with backward compatibility

### Manual Review
Critical conflicts flagged in:
- Pull request with detailed explanation
- Sync status file
- Agent logs

## Monitoring & Verification

### Sync Health Checks
- Verify file checksum after sync
- Validate JSON/YAML syntax
- Check markdown link validity
- Ensure no broken references

### Status Tracking
Sync status stored in:
- `/ollamatracks/SYNC_STATUS.txt`
- GitHub commit messages (with [sync] tag)
- GitHub Actions logs

## Master Awareness
QMOI Ollama Agent maintains awareness of:
- Master decisions and commands
- Sync preferences and priorities
- Special handling requirements
- Manual intervention needs

## Emergency Procedures

### If Sync Fails
1. Log detailed error to SYNC_STATUS.txt
2. Flag as critical in pull request
3. Stop automatic merges
4. Wait for manual intervention
5. Retry after manual fix

### If Files Diverge
1. Detect divergence automatically
2. Create comparison report
3. Flag in agent logs
4. Suggest merge strategy
5. Wait for confirmation

## Related Documentation
- [MERGE.md](MERGE.md) - Detailed merge procedures by file type
- [or.md](or.md) - Operations reference and progress tracking
- [zx.txt](zx.txt) - Alpha-Q-ai specific workflow setup instructions

## Notes
This document is automatically maintained and updated by QMOI Ollama Autonomous Agent.
Last Updated: 2026-08-17T21:30:00Z
