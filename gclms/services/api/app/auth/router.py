"""
GCLMS API — Auth Router
Handles User Login, Current User Context, and Session Revocation.
"""

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth.service import AuthenticatedUserContext, create_access_token, hash_password, verify_password
from app.common.models import UserRole, UserStatus
from app.config import get_settings
from app.database import get_db
from app.dependencies import get_current_user
from app.users.models import SchoolMembership, User

router = APIRouter()
settings = get_settings()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/login", response_model=LoginResponse)
async def login(
    payload: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """Authenticate user with email and password, returning JWT and setting HTTP-only cookie."""
    stmt = (
        select(User)
        .options(selectinload(User.memberships).selectinload(SchoolMembership.school))
        .where(User.email == payload.email.lower().strip(), User.deleted_at.is_(None))
    )
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if user.status != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or suspended.",
        )

    primary_mem = next((m for m in user.memberships if m.is_primary), user.memberships[0] if user.memberships else None)
    role = primary_mem.role if primary_mem else UserRole.STUDENT
    school_id = primary_mem.school_id if primary_mem else None
    school_name = primary_mem.school.name if primary_mem and primary_mem.school else None

    token = create_access_token(user_id=user.id, role=role, school_id=school_id)

    # Set secure HTTP-only cookie
    response.set_cookie(
        key="gclms_access_token",
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.jwt_access_expires_minutes * 60,
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": role.value,
            "school_id": school_id,
            "school_name": school_name,
        },
    }


@router.get("/me")
async def get_me(current_user: AuthenticatedUserContext = Depends(get_current_user)):
    """Return authenticated user context."""
    return {
        "data": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role.value,
            "school_id": current_user.school_id,
            "status": current_user.status.value,
        }
    }


@router.post("/logout")
async def logout(response: Response):
    """Clear session cookie."""
    response.delete_cookie(key="gclms_access_token")
    return {"data": {"message": "Logged out successfully."}}
