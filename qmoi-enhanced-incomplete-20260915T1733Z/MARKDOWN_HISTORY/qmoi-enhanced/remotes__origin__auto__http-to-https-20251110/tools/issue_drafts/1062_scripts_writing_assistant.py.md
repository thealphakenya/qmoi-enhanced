---
title: "Issue draft for scripts/writing_assistant.py"
generated: 2025-11-08T16:06:39.002057Z
---

# Review needed: scripts/writing_assistant.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
ok#!/usr/bin/env python3
"""
QMOI Ethical Writing Assistant
---------------------------------
Provides tools that help users produce original, well-cited work while preserving academic integrity.

Features:
- Originality assistant: outline → draft scaffolding with prompts and source slots
- Style coach: adapt to a user voice profile without impersonation or deception
- Self-similarity checker: local n-gram/Jaccard to flag high-overlap sections
- Citation builder: APA/MLA/Chicago quick-formatters from minimal fields
- Rubric reviewer: rubric-driven checklist with actionable suggestions

This tool avoids any intent to deceive detection systems or misrepresent authorship.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from typing import Dict, List, Tuple


# -------------------------
# Utilities
# -------------------------

def normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return re.sub(r"\s+", " ", text).strip()


def split_sentences(text: str) -> List[str]:
    text = normalize_text(text)
    # Simple sentence split; deliberately lightweight
    return re.split(r"(?<=[.!?])\s+", text) if text else []


def ngrams(tokens: List[str], n: int) -> List[Tuple[str, ...]]:
    return [tuple(tokens[i : i + n]) for i in range(0, max(len(tokens) - n + 1, 0))]


def jaccard(a: set, b: set) -> float:
    return len(a & b) / max(len(a | b), 1)


# -------------------------
# Originality Assistant
# -------------------------

def generate_outline(topic: str, sections: int = 5) -> Dict[str, List[str]]:
    sections = max(3, min(sections, 10))
    outline = {"title": topic, "sections": []}
    for i in range(sections):
        outline["sections"].append(
            {
                "heading": f"Section {i+1}: Key Aspect",
                "prompts": [
                    "State the claim in your own words",
                    "Provide 1-2 reputable sources with brief summaries",
                    "Explain evidenc
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
