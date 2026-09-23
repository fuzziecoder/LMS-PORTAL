"""
GCLMS API — Application Configuration

Centralized settings loaded from environment variables via Pydantic Settings.
"""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- General ---
    app_env: Literal["development", "staging", "production"] = "development"
    app_name: str = "GCLMS"
    app_debug: bool = True

    # --- URLs ---
    web_url: str = "http://localhost:3000"
    api_url: str = "http://localhost:8000"

    # --- Database ---
    database_url: str = "postgresql+asyncpg://gclms:gclms@postgres:5432/gclms"

    # --- Redis ---
    redis_url: str = "redis://redis:6379/0"

    # --- JWT / Auth ---
    jwt_secret: str = "replace-this-with-a-long-random-secret-min-64-chars"
    jwt_algorithm: str = "HS256"
    jwt_access_expires_minutes: int = 15
    jwt_refresh_expires_days: int = 30

    # --- Cookies ---
    cookie_secure: bool = False
    cookie_domain: str = "localhost"
    cookie_samesite: Literal["lax", "strict", "none"] = "lax"

    # --- S3 / MinIO ---
    s3_endpoint: str = "http://minio:9000"
    s3_public_endpoint: str = "http://localhost:9000"
    s3_access_key: str = "minioadmin"
    s3_secret_key: str = "minioadmin"
    s3_bucket: str = "gclms-files"
    s3_region: str = "us-east-1"

    # --- Mail ---
    mail_host: str = "mailpit"
    mail_port: int = 1025
    mail_from: str = "no-reply@gclms.local"

    # --- Observability ---
    sentry_dsn: str = ""
    otel_exporter_otlp_endpoint: str = ""

    # --- Celery ---
    celery_broker_url: str = "redis://redis:6379/1"
    celery_result_backend: str = "redis://redis:6379/2"

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    """Cached settings singleton."""
    return Settings()
