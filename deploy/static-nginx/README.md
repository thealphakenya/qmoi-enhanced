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