FROM mcr.microsoft.com/devcontainers/base:bullseye

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        apt-transport-https \
        ca-certificates \
        curl \
        wget \
        jq \
        unzip \
        zip \
        git-lfs \
        build-essential \
        pkg-config \
        libssl-dev \
        zlib1g-dev \
        libbz2-dev \
        libreadline-dev \
        libsqlite3-dev \
        libncursesw5-dev \
        xz-utils \
        tk-dev \
        libxml2-dev \
        libxmlsec1-dev \
        libffi-dev \
        liblzma-dev \
        libyaml-dev \
        libpq-dev \
        postgresql-client \
        netcat-openbsd \
        procps \
        lsof \
        dnsutils \
        gnupg \
        sudo \
    && rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-lc"]
