import logging
import sys

from app.core.config import settings


def configure_logging() -> None:
    """Configure a simple, readable logging format for the whole app."""
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )
