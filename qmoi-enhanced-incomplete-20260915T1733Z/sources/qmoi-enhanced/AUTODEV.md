# AUTODEV.md - Autonomous Development Framework

## Overview
This document formalizes how the QMOI automation stack should behave while operating autonomously across repositories and validation workflows.

## Autonomous Capabilities
- read and apply instructions from repo docs
- monitor workflow health
- repair broken scripts and YAML
- self-resume after interruption
- validate app and platform matrix
- maintain documentation inventory
- synchronize repo state across branches and repos

## Execution Model
1. Detect repository state
2. Validate core contracts
3. Repair missing or corrupted files
4. Run validation suite
5. Record checkpoints
6. Update docs and progress markers
7. Push or prepare PR state when appropriate

## Success Criteria
The autonomous development process is considered successful when:
- tests pass
- doc inventory is complete
- workflows are valid
- recovery logic remains active
- repo state remains accessible and consistent
