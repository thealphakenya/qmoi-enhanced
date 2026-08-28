# MERGE.md - Merge Procedures and Guidelines

## Overview
This document provides comprehensive procedures for merging files and features between qmoi-enhanced and Alpha-Q-ai repositories. It ensures that no implementations are degraded, features are preserved, and conflicts are resolved intelligently.

## Core Merge Principles

1. **Preservation**: All existing features and implementations must be preserved
2. **Intelligence**: Use context-aware decision making for conflict resolution
3. **Verification**: Validate all merges to ensure integrity
4. **Traceability**: Document all merge decisions and rationales
5. **Accountability**: QMOI maintains full accountability for all merge decisions

## Autonomous History Audit Contract

Before any cross-repository merge, the agent must create a read-only audit for
both `thealphakenya/qmoi-enhanced` and `thealphakenya/Alpha-Q-ai`. The audit
records every reachable branch, the complete Git-tracked file structure, and
commit author, email, timestamp, subject, and hash. It must inspect all
contributors for QMOI Enhanced and at least the latest four reachable commits
for Alpha-Q-ai. A merge is not considered traceable until the activity and its
audit evidence are appended to this file through the agent's merge-log API.

The audit is evidence collection only: it must not fetch, merge, reset, or push
implicitly. Network synchronization and publication remain explicit workflow
steps, followed by validation and a recorded result.

## Required History Source And Complete Coverage

The ref `origin/codespace-potential-space-happiness-wrv69x5j6qjq2g7wp` is a
required historical source for every merge audit. Its complete branch contents
are materialized in `qmoi-enhanced-history-14/`, whose instruction file records
the source commit. The snapshot is part of merge input and recovery evidence;
it is not merely a note or an optional backup.

Before planning a merge, QMOI must inventory both repositories, every reachable
local and remote branch, every tracked path (including symlinks and currently
unused files/directories), and every commit needed for attribution. For each
path, record repository/ref, existence, content identity, dependencies,
implementation role, and classification: `QE`, `AQ`, `BOTH`, `HISTORICAL`, or
`CONFLICT`. Missing paths from the historical source must be evaluated for
restoration and feature degradation before they can be omitted. `CONFLICT` or
uncertain ownership blocks automatic changes and requires a review record.

`ALLMDFILESREFS.md` is updated from the complete `.md` inventory for both live
repositories and the historical ref, including markdown files not present in
the current checkout. The inventory is evidence, not permission to copy stale
content blindly.

## Autonomous Merge Procedure

1. Discover repository remotes, all refs, default/backup/history branches, and
    working-tree state without mutation.
2. Capture immutable inventories of all trees, markdown paths, commits,
    contributors, timestamps, symlinks, and the `qmoi-enhanced-history-14`
    materialization.
3. Determine ownership from imports, workflow/config references, package/build
    dependencies, history, and repository boundaries. Preserve unused content
    until this analysis is complete.
4. Build a path-level plan for additions, updates, deletions, and conflicts;
    checkpoint it before applying anything. Never auto-delete a path solely
    because it is absent from the target branch.
5. Apply only authorized changes inside the intended repository. Reject unsafe
    paths, secret/authentication changes, destructive commands, and unreviewed
    conflict resolutions.
6. Validate syntax, dependencies, links, workflows, targeted tests, full tests,
    feature preservation, and the complete post-merge tree against every source.
7. Update `MERGE.md`, `ALLMDFILESREFS.md`, checkpoint, telemetry, and the final
    proof contract with source refs, counts, decisions, and validation evidence.
8. Push or merge only when all required evidence passes and authorization is
    present. A partial inventory, inferred success, or Python-only check is a
    failed merge gate.

The Ollama autonomous agent and QMOI automation must use this procedure for
branch sync, PR merge, recovery, auto-healing, and cross-repository operations.
They may automate speed and repetition, but not bypass evidence, ownership,
review, or validation gates.

## File Type Specific Procedures

### Markdown Files (.md)

#### Pre-Merge Validation
```python
- Check syntax validity
- Validate link references
- Verify heading hierarchy
- Check for duplicate sections
- Validate table formatting
```

#### Merge Strategy
- **Content Merge**: Combine information from both files
- **Section Conflict**: Keep both sections with "merged" marker
- **Duplicate Sections**: Combine into single section
- **Cross-References**: Update to point to merged locations

#### Post-Merge Actions
1. Run markdown linter
2. Validate all links
3. Update table of contents if present
4. Verify no orphaned references

### Python Files (.py)

#### Pre-Merge Analysis
- Syntax check both files
- Analyze import dependencies
- Identify overlapping functions/classes
- Check for conflicts in global state

#### Merge Strategy
- **Functions**: Keep both if non-conflicting, merge if duplicates
- **Classes**: Use inheritance if complementary, merge if duplicates
- **Imports**: De-duplicate imports, preserve all needed modules
- **Constants**: Check for value conflicts, merge if compatible

#### Conflict Resolution
```python
# If function exists in both files:
# 1. If identical: Keep one
# 2. If slightly different: Create wrapper version
# 3. If significantly different: Create parameterized version
# 4. Last resort: Mark for manual review and create PR
```

#### Post-Merge Validation
1. `python3 -m py_compile` both files
2. Run unit tests for affected modules
3. Check for import errors
4. Validate function signatures

### TypeScript/JavaScript Files (.ts, .tsx, .js, .jsx)

#### Pre-Merge Analysis
- Check TypeScript compilation
- Analyze component dependencies
- Identify shared utilities
- Check for prop/type conflicts

#### Merge Strategy
- **React Components**: Merge props and functionality
- **Utilities**: De-duplicate, create shared module if needed
- **Styles**: Merge CSS/styled-components
- **Types**: Merge interfaces, use union types if needed

#### Post-Merge Validation
1. Run TypeScript compiler
2. Run linter (ESLint)
3. Run unit tests
4. Check for missing imports

### JSON Files (.json)

#### Pre-Merge Validation
- Validate JSON syntax in both files
- Identify structural differences
- Check for key conflicts

#### Merge Strategy
- **Configuration Files**: Deep merge objects
- **Package.json**: Merge dependencies, use highest version
- **Other JSON**: Merge arrays if applicable, objects recursively

#### Post-Merge Format
```bash
# Ensure consistent formatting
jq '.' merged.json > formatted.json
```

### YAML Files (.yml, .yaml)

#### Pre-Merge Validation
- Validate YAML syntax
- Check for key collisions
- Identify structural conflicts

#### Merge Strategy
- **GitHub Actions**: Merge steps logically
- **Configuration**: Deep merge configuration objects
- **Mappings**: Merge sequentially, preserve order

#### Post-Merge Validation
1. Validate YAML syntax
2. Check GitHub Actions format if applicable
3. Verify all required keys present
4. Test workflow if GitHub Actions file

### Kotlin Files (.kt)

#### Pre-Merge Analysis
- Check Kotlin compilation
- Analyze class/object dependencies
- Check for extension function conflicts

#### Merge Strategy
- **Classes**: Merge properties and methods
- **Extensions**: De-duplicate, combine if non-conflicting
- **Interfaces**: Merge, use composition if needed

### Specialized Merge Procedures

#### API.md Merge
```
1. Extract all API definitions from both files
2. De-duplicate by endpoint path
3. Verify version compatibility
4. Merge request/response schemas
5. Combine examples
6. Update API version if changed
```

#### ENDPOINTS.md Merge
```
1. List all endpoints from both repos
2. Group by functionality
3. Check for duplicates by path
4. Verify HTTP methods
5. Merge descriptions
6. Update endpoint count
```

#### ROUTES.md Merge
```
1. Extract routes from both files
2. Check for path conflicts
3. Merge route handlers
4. Verify middleware stacks
5. Combine route groups
6. Update route documentation
```

#### STYLES.md Merge
```
1. Collect all styles from both repos
2. Identify user-specific styles
3. Merge into unified style guide
4. Flag unclear style assignments to "styles dilemma master"
5. Create selection matrix for master
6. Implement per-user style selection logic
```

## Handling Special Cases

### Missing Implementations
If a feature is mentioned but not implemented:
1. Flag as TODO
2. Create issue in appropriate repo
3. Note dependency in merge record
4. Plan implementation timeline

### Conflicting Implementations
If two different implementations exist:
1. Compare performance characteristics
2. Compare feature completeness
3. Analyze code quality
4. Make informed decision
5. Document rationale
6. Archive unused implementation

### Feature Degradation Detection
```python
def detect_degradation(source_file, target_file, merged_file):
    """Ensure no features are lost in merge"""
    source_features = extract_features(source_file)
    target_features = extract_features(target_file)
    merged_features = extract_features(merged_file)
    
    all_features = source_features | target_features
    lost_features = all_features - merged_features
    
    if lost_features:
        raise MergeDegradationError(f"Lost features: {lost_features}")
    
    return True
```

## Merge Decision Matrix

| Situation | Decision | Rationale |
|-----------|----------|-----------|
| Identical content | Keep one | No difference |
| Minor differences | Merge intelligently | Preserve all info |
| Conflicts | Use context | Choose better version |
| Both needed | Create wrapper | Support both |
| Unclear | Mark for review | Manual verification |
| Degrading | Reject | Preserve features |

## Merge Validation Checklist

Before finalizing any merge:
- [ ] Syntax validation passed
- [ ] All imports/dependencies resolved
- [ ] No feature degradation detected
- [ ] Conflicts resolved intelligently
- [ ] Unit tests passing
- [ ] Documentation updated
- [ ] Links verified
- [ ] Version numbers updated if needed
- [ ] Changelog entry added
- [ ] Security implications reviewed
- [ ] Performance implications reviewed
- [ ] Backward compatibility verified

## Merge Conflict Resolution Process

### Step 1: Identify Conflict Type
- Code logic conflict
- Configuration conflict
- Data structure conflict
- Documentation conflict

### Step 2: Analyze Context
- Check git history
- Review original intent
- Consider both implementations
- Check for cross-dependencies

### Step 3: Apply Resolution Strategy
- **Logic Conflicts**: Create combined implementation
- **Config Conflicts**: Merge preserving all settings
- **Structure Conflicts**: Adapt to compatible structure
- **Documentation**: Merge information

### Step 4: Validate Resolution
- Test merged code
- Verify documentation links
- Ensure no broken references
- Confirm feature preservation

### Step 5: Document Decision
```markdown
## Merge Decision Log

### File: [filename]
- Conflict Type: [type]
- Decision: [decision made]
- Rationale: [why this decision]
- Validation: [how validated]
- Approver: [QMOI Agent or Master]
- Timestamp: [ISO timestamp]
```

## Automation & QMOI Agent Integration

### Agent Responsibilities
- Automatically detect merge-able files
- Apply intelligent merge strategies
- Validate all merges
- Flag conflicts for manual review
- Generate merge reports
- Update documentation

### Manual Intervention Cases
QMOI flags for manual review:
- Semantic conflicts (logic doesn't work)
- Architectural conflicts
- Security-sensitive merges
- Major feature changes
- Unclear merge intent

## Tools & Commands

### Validate Markdown
```bash
markdownlint file.md
```

### Validate Python
```bash
python3 -m py_compile file.py
pylint file.py
```

### Validate JSON
```bash
python3 -m json.tool file.json > /dev/null
```

### Validate YAML
```bash
python3 -c "import yaml; yaml.safe_load(open('file.yml'))"
```

### Merge with Git
```bash
git merge --no-commit --no-ff branch-name
# Review
git merge --abort  # if problems
# or
git commit -m "Merge branch..."
```

## Best Practices

1. **Always backup**: Keep originals before merge
2. **Test thoroughly**: Validate all merged files
3. **Document decisions**: Record why merges were done
4. **Verify features**: Ensure no feature loss
5. **Update docs**: Keep documentation synchronized
6. **Commit atomically**: One logical change per commit
7. **Use meaningful messages**: Clear commit messages
8. **Review carefully**: Peer review all merges
9. **Automate validation**: Run tests automatically
10. **Plan ahead**: Anticipate merge needs

## Troubleshooting

### Merge Conflicts Won't Resolve
1. Review conflict markers carefully
2. Understand both versions' intent
3. Consider creating hybrid version
4. Escalate to manual review if needed

### Test Failures After Merge
1. Run individual component tests
2. Check for import issues
3. Verify configuration values
4. Look for hardcoded paths
5. Check version compatibility

### Documentation Links Broken
1. Search for old file names
2. Update all references
3. Verify new structure
4. Run link checker
5. Update table of contents

## Related Documentation
- [SYNC.md](SYNC.md) - Synchronization between repositories
- [or.md](or.md) - Operations reference
- [zx.txt](zx.txt) - Alpha-Q-ai workflow setup

---
**Version**: 1.0
**Last Updated**: 2026-08-17
**Maintained By**: QMOI Ollama Autonomous Agent
