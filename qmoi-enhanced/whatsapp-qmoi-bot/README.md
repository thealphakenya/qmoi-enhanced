---
title: "WhatsApp Qmoi Bot"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# WhatsApp Qmoi Bot

## Overview
A WhatsApp automation bot powered by Qmoi AI, using Baileys for WhatsApp Web integration. Supports messaging, media, group management, broadcasting, and advanced AI features.

## Features
- Persistent WhatsApp session (auth.json)
- Master/sister onboarding via QR code
- AI-powered replies, media, and group actions
- Broadcast and scheduled campaigns
- Secure, encrypted data handling
- Runs 24/7 in Colab, Docker, or cloud

## Setup
1. Install dependencies: `npm install @whiskeysockets/baileys @hapi/boom axios`
2. Run `node index.js` to start the bot and scan the QR code with your WhatsApp (Linked Devices)
3. The bot will stay online and use Qmoi for all intelligence

## Folder Structure
- `index.js` - Main bot logic
- `handlers/` - Text, media, group handlers
- `services/` - Qmoi AI connector
- `utils/` - Delay, broadcast, and helper utilities

## Security
- All sensitive data is encrypted
- No real data is exposed in exports or unzipped builds

## Extending
- Add new handlers for calls, video, or custom features
- Integrate with Qmoi for animation/game generation, subtitles, and more

## 2025-06-13: WhatsApp Qmoi Bot Handlers & Security
- Handlers for calls, video, voice, vision, subtitles, downloads, notifications, marketing, projects, app download, secure data, scheduling, and animation/game generation.
- All handlers use Qmoi for intelligence and are fully integrated with the WhatsApp bot.
- Data encryption for all sensitive information.

## 2025-06-13: Wallet, Child-Friendly, and Robust AI Features
- WhatsApp Qmoi Bot now supports wallet automation, child-friendly features (music, stories, conversations), and robust, thorough, and fast AI task handling.

---

<!-- QMOI_VALIDATION_START -->
{
  "file": "qmoi-enhanced/whatsapp-qmoi-bot/README.md",
  "validated_at": "2025-10-26T20:51:24.874748Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "WhatsApp Qmoi Bot"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->
