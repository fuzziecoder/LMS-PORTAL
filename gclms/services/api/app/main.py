"""
GCLMS API — FastAPI Application Entry Point

Main application factory with middleware, CORS, lifecycle events,
and router mounting.
"""

import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.auth.router import router as auth_router
from app.config import get_settings
from app.database import close_db, init_db
from app.files.router import router as files_router
from app.logging import get_logger, setup_logging
from app.principal.router import router as principal_router
from app.teacher.router import router as teacher_router

settings = get_settings()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle."""
    # --- Startup ---
    setup_logging(
        log_level="DEBUG" if settings.is_development else "INFO",
        json_output=not settings.is_development,
    )
    logger.info("Starting GCLMS API", env=settings.app_env)

    try:
        await init_db()
        logger.info("Database connected")
    except Exception as e:
        logger.warning(f"Database connection deferred: {e}")

    yield

    # --- Shutdown ---
    await close_db()
    logger.info("GCLMS API shut down")


app = FastAPI(
    title="GCLMS API",
    description="Global Cloud Learning Management System — Backend API",
    version="0.1.0",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan,
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.web_url, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request ID Middleware ---
@app.middleware("http")
async def request_id_middleware(request: Request, call_next) -> Response:
    """Attach a unique request ID to every request/response."""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    response: Response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


# ============================================================
# Health Check
# ============================================================
@app.get("/api/v1/health", tags=["System"])
async def health_check():
    """Health check endpoint for Docker, load balancers, and monitoring."""
    return {
        "data": {
            "status": "healthy",
            "service": "gclms-api",
            "version": "0.1.0",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
        "meta": {
            "request_id": "health-check",
        },
    }


# ============================================================
# Domain Router Mounting
# ============================================================
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(principal_router, prefix="/api/v1/principal", tags=["Principal"])
app.include_router(teacher_router, prefix="/api/v1/teacher", tags=["Teacher"])
app.include_router(files_router, prefix="/api/v1/files", tags=["Files"])
