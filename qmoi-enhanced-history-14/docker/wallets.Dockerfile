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
