<!-- AUTODEV Enhanced: 2026-04-20T09:01:23.030431 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:15.956362 -->
FROM python:3.11-slim
WORKDIR /app

# install minimal system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# copy project files needed to run wallets API
COPY . /app
WORKDIR /app

# install only runtime deps used by wallets API
RUN pip install --no-cache-dir requests Flask

ENV PYTHONUNBUFFERED=1
EXPOSE 8765

CMD ["python3", "scripts/wallets/wallets_api.py"]
