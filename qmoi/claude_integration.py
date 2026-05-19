#!/usr/bin/env python3
"""Claude integration client for QMOI."""
import json
import logging
import os
from typing import Any, Dict, Optional
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

CLAUDE_API_KEY_ENV = "CLAUDE_API_KEY"
CLAUDE_API_BASE_ENV = "CLAUDE_API_BASE"
DEFAULT_CLAUDE_BASE = "https://api.anthropic.com/v1"


class ClaudeIntegration:
    def __init__(self, api_key: Optional[str] = None, api_base: Optional[str] = None) -> None:
        self.api_key = api_key or os.getenv(CLAUDE_API_KEY_ENV)
        self.api_base = api_base or os.getenv(CLAUDE_API_BASE_ENV, DEFAULT_CLAUDE_BASE)

    def initialize(self, api_key: Optional[str] = None, api_base: Optional[str] = None) -> bool:
        self.api_key = api_key or self.api_key or os.getenv(CLAUDE_API_KEY_ENV)
        self.api_base = api_base or self.api_base or os.getenv(CLAUDE_API_BASE_ENV, DEFAULT_CLAUDE_BASE)
        if not self.api_key:
            raise EnvironmentError(f"Missing Claude API key environment variable: {CLAUDE_API_KEY_ENV}")
        logger.info("Initialized Claude integration with base=%s", self.api_base)
        return True

    def send_prompt(self, prompt: str, model: str = "claude-2", temperature: float = 0.7) -> Dict[str, Any]:
        self.initialize()
        payload = {
            "model": model,
            "input": prompt,
            "temperature": temperature,
        }
        request = Request(
            url=f"{self.api_base}/complete",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "X-API-Key": self.api_key,
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=30) as response:
                raw = response.read().decode("utf-8")
                return json.loads(raw)
        except HTTPError as exc:
            content = exc.read().decode("utf-8") if hasattr(exc, "read") else ""
            logger.error("Claude API HTTPError %s: %s", exc.code, content)
            return {"error": {"status_code": exc.code, "message": content}}
        except URLError as exc:
            logger.error("Claude API URLError: %s", exc)
            return {"error": {"message": str(exc)}}
