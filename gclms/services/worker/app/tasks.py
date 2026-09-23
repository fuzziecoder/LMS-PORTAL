"""
GCLMS Worker — Background Tasks

Task definitions for async background processing.
"""

import logging
from app.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="tasks.health_check")
def worker_health_check() -> dict:
    """Simple ping task to verify worker responsiveness."""
    logger.info("Worker health check task executed successfully")
    return {"status": "ok", "worker": "gclms-worker"}
