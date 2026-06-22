---
quantum-enabled: false
---

QMOI Static Production nginx
=================================

This folder provides a small nginx-based Docker image to serve the repository `public/` directory as a production-grade static fallback for QMOI AI.

Build and run (Docker):

```bash
# from repository root
cd deploy/static-nginx
docker build -t qmoi-static:latest .
docker run -p 8080:80 --rm qmoi-static:latest
```

Or use docker-compose:

```bash
cd deploy/static-nginx
docker compose up --build
```

The static QMOI AI entry will be available at:

http://localhost:8080/pwa_apps/qmoi-ai/index.html

Notes:
- nginx is configured to fallback to the QMOI AI PWA index for SPA routing.
- Adjust caching or headers in `nginx.conf` as needed for your environment.

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: 2026-06-22T19:07:45.480882Z
- production status: ⚠️ review / no explicit production status
- status tags: review
- lines: 50
- words: 175
- characters: 1221
- headings: 2
- links: 0
- images: 0
- tables: 0
- lion validation block: present
<!-- LION_VALIDATION_END -->
