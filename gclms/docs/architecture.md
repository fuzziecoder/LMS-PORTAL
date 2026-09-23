# GCLMS Architecture Overview

## High-Level Architecture

```
Users (Browsers / Mobile)
        │
        ▼ HTTPS
Next.js Web Application (App Router, React, Tailwind CSS, shadcn/ui)
        │
        ▼ REST APIs / HTTPS / HTTP Cookies
FastAPI Modular Monolith Service (Python 3.12, Pydantic v2, SQLAlchemy 2)
   ├── Auth Module & RBAC Middleware
   ├── Multi-Tenant Scoping Engine
   └── Domain Modules (Schools, Users, Courses, Assignments, Quizzes, Attendance, etc.)
        │
   ┌────┴───────────────────────────┬────────────────────────────┐
   ▼                                ▼                            ▼
PostgreSQL 16                 Redis 7                      MinIO / S3
(Primary Database)           (Cache / Queue / Rate Limit)  (Object Storage)
                                    │
                                    ▼
                         Celery Background Worker
                   (Emails, Notifications, Reports, Jobs)
```

## Architectural Principles

1. **Modular Monolith**: Strongly bounded domains inside a single FastAPI service to maximize velocity without microservice overhead.
2. **Strict Multi-Tenancy**: Data isolation at the database layer via school scoping helpers and RBAC policies.
3. **Stateless API & Cookie Auth**: JWT tokens stored in HTTP-only, SameSite cookies with refresh token rotation.
4. **Asynchronous Background Processing**: Offload heavy work (mass notifications, report generation) to Celery workers via Redis.
