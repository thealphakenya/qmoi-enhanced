#!/usr/bin/env python3
"""Device enhancer stub."""
import logging
from pathlib import Path

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def set_wallpaper(image_path: Path) -> None:
    logger.info(f'Setting wallpaper: {image_path}')
