# QMOIDATABASE.md

This document defines the database and persistence model for QMOI clone/autoclone operations, platform sync, memory indexing, and runtime health tracking. The database layer remains a central source of state for the autonomous agent and the live repo.

## Active automation
- memory index and runtime data remain synchronized with repo health and platform state.
- clone/autoclone surfaces all depend on the same persistent state model.
- the autonomous agent refreshes database and platform knowledge before promotion.

