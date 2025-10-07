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
