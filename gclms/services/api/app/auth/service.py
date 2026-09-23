"""
GCLMS API — Authentication and Security Service
Argon2id password hashing, JWT creation/decoding, and cookie handlers.
"""

from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.common.models import UserRole, UserStatus
from app.config import get_settings
from app.users.models import SchoolMembership, User

ph = PasswordHasher()
settings = get_settings()


def hash_password(password: str) -> str:
    """Hash password using Argon2id."""
    return ph.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against Argon2id hash."""
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False


def create_access_token(user_id: str, role: UserRole, school_id: str | None = None) -> str:
    """Create short-lived JWT access token."""
    now = datetime.now(timezone.utc)
    expires = now + timedelta(minutes=settings.jwt_access_expires_minutes)
    payload = {
        "sub": user_id,
        "role": role.value if isinstance(role, UserRole) else str(role),
        "school_id": school_id,
        "iat": int(now.timestamp()),
        "exp": int(expires.timestamp()),
        "type": "access",
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Please log in again.",
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials.",
        )


class AuthenticatedUserContext:
    """Carries current authenticated user and their active school context."""

    def __init__(self, user: User, role: UserRole, school_id: str | None):
        self.user = user
        self.id = user.id
        self.name = user.name
        self.email = user.email
        self.role = role
        self.school_id = school_id
        self.status = user.status
