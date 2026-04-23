<!-- AUTODEV Enhanced: 2026-04-20T09:08:06.948172 -->
<!-- AUTODEV Enhanced: 2026-04-20T09:01:14.432466 -->
<!-- AUTODEV Enhanced: 2026-04-20T08:55:10.370574 -->
# Use NVIDIA CUDA base image
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu20.04

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    TZ=UTC

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3.8 \
    python3-pip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p logs deployed_model

# Set environment variables for model serving
ENV MODEL_PATH=/app/deployed_model/model.onnx \
    CONFIG_PATH=/app/deployed_model/config.json \
    HOST=0.0.0.0 \
    PORT=8000 \
    WORKERS=1

# Expose port
EXPOSE 8000

# Start the server
CMD ["python3", "scripts/deployment/server.py"] 