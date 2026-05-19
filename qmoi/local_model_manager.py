#!/usr/bin/env python3
"""Local model manager for QMOI."""
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class LocalModelManager:
    def __init__(self, models_dir: Optional[str] = None) -> None:
        self.models_dir = Path(models_dir or Path.cwd() / "models")
        self.models_dir.mkdir(parents=True, exist_ok=True)

    def discover_models(self) -> List[str]:
        logger.info("Discovering local models in %s", self.models_dir)
        return [str(path.name) for path in self.models_dir.iterdir() if path.is_dir()]

    def load_model(self, model_name: str) -> Dict[str, Any]:
        model_path = self.models_dir / model_name
        logger.info("Loading local model %s from %s", model_name, model_path)
        if not model_path.exists():
            raise FileNotFoundError(f"Local model not found: {model_name}")
        return {"model_name": model_name, "model_path": str(model_path)}

    def register_model(self, model_name: str, source_path: str) -> Dict[str, Any]:
        destination = self.models_dir / model_name
        destination.mkdir(parents=True, exist_ok=True)
        logger.info("Registered local model %s at %s", model_name, destination)
        return {"model_name": model_name, "model_path": str(destination), "source": source_path}
