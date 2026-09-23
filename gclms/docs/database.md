# GCLMS Database Schema Documentation

## Database Technology
- **Engine**: PostgreSQL 16
- **Primary Keys**: UUID v4
- **Timestamps**: UTC timezone-aware (`created_at`, `updated_at`)
- **ORM**: SQLAlchemy 2 (Asyncio)
- **Migrations**: Alembic

## Core Entities
- `users`: Identity and authentication records.
- `schools`: Tenant entities.
- `user_school_memberships`: Role and membership link between users and schools.
- `refresh_tokens`: Hashed JWT refresh tokens for session rotation.
- `audit_logs`: Audit trail for compliance and operations.
- `files`: Metadata records for S3-stored media and documents.
