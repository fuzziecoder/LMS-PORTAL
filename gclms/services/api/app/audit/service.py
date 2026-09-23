"""
GCLMS API — Audit Logging Service
"""

from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.models import AuditLog


async def log_action(
    db: AsyncSession,
    school_id: str | None,
    actor_id: str | None,
    actor_role: str,
    action: str,
    resource_type: str,
    resource_id: str | None = None,
    details: dict[str, Any] | None = None,
    ip_address: str | None = None,
) -> AuditLog:
    """Records an immutable audit log entry."""
    entry = AuditLog(
        school_id=school_id,
        actor_id=actor_id,
        actor_role=actor_role,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details or {},
        ip_address=ip_address,
    )
    db.add(entry)
    await db.flush()
    return entry
