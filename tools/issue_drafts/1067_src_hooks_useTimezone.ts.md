---
title: "Issue draft for src/hooks/useTimezone.ts"
generated: 2025-11-08T16:06:39.005285Z
---

# Review needed: src/hooks/useTimezone.ts

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
import { useState, useEffect, useCallback } from "react";

interface Timezone {
  label: string;
  value: string;
  offset: string;
  emoji: string;
}

const timezones: Timezone[] = [
  {
    label: "Nairobi, Kenya",
    value: "Africa/Nairobi",
    offset: "UTC+3",
    emoji: "🇰🇪",
  },
  {
    label: "Melbourne, Australia",
    value: "Australia/Melbourne",
    offset: "UTC+10",
    emoji: "🇦🇺",
  },
  {
    label: "New York, USA",
    value: "America/New_York",
    offset: "UTC-5",
    emoji: "🇺🇸",
  },
  { label: "London, UK", value: "Europe/London", offset: "UTC+0", emoji: "🇬🇧" },
  { label: "Tokyo, Japan", value: "Asia/Tokyo", offset: "UTC+9", emoji: "🇯🇵" },
  { label: "Dubai, UAE", value: "Asia/Dubai", offset: "UTC+4", emoji: "🇦🇪" },
  {
    label: "Mumbai, India",
    value: "Asia/Kolkata",
    offset: "UTC+5:30",
    emoji: "🇮🇳",
  },
  { label: "Singapore", value: "Asia/Singapore", offset: "UTC+8", emoji: "🇸🇬" },
  {
    label: "Paris, France",
    value: "Europe/Paris",
    offset: "UTC+1",
    emoji: "🇫🇷",
  },
  {
    label: "Sydney, Australia",
    value: "Australia/Sydney",
    offset: "UTC+10",
    emoji: "🇦🇺",
  },
  {
    label: "Toronto, Canada",
    value: "America/Toronto",
    offset: "UTC-5",
    emoji: "🇨🇦",
  },
  {
    label: "Berlin, Germany",
    value: "Europe/Berlin",
    offset: "UTC+1",
    emoji: "🇩🇪",
  },
  {
    label: "Moscow, Russia",
    value: "Europe/Moscow",
    offset: "UTC+3",
    emoji: "🇷🇺",
  },
  {
    label: "Beijing, China",
    value: "Asia/Shanghai",
    offset: "UTC+8",
    emoji: "🇨🇳",
  },
  {
    label: "Seoul, South Korea",
    value: "Asia/Seoul",
    offset: "UTC+9",
    emoji: "🇰🇷",
  },
  {
    label: "Mexico City, Mexico",
    value: "America/Mexico_City",
    offset: "UTC-6",
    emoji: "🇲🇽",
  },
  {
    label: "São Paulo, Brazil",
    value: "America/Sao_Paulo",
    offset: "UTC-3",
    emoji: "🇧🇷",
  },
  {
    label: "Cairo, Egypt",
    value: "Africa/Cairo",
    offset: "UTC+2",
    emoji: "🇪🇬",
  },
  {
    label: "Johannesburg, South Africa",

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
