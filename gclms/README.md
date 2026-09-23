# GCLMS — Global Cloud Learning Management System

> Production-quality multi-tenant edtech platform built for schools teaching Artificial Intelligence, Robotics, Python Programming, IoT, Web Development, and Innovation.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Recharts, Lucide Icons, Sonner.
- **Backend API**: Python 3.12, FastAPI, Pydantic v2, Async SQLAlchemy 2, Alembic, Argon2id, PyJWT, structlog.
- **Database & Cache**: PostgreSQL 16, Redis 7.
- **Storage & Mail**: MinIO (S3 compatible), Mailpit.
- **Task Worker**: Celery worker with Redis broker.
- **Infrastructure**: Docker Compose, GitHub Actions CI.

---

## 🛠️ Quick Start

```bash
# 1. Setup environment & start Docker containers
make setup

# 2. Run backend pytest tests
make test-api
```

### 📍 Local Service URLs

| Service | URL | Credentials |
| --- | --- | --- |
| **Web Portal** | http://localhost:3000 | - |
| **API Server** | http://localhost:8000 | - |
| **API Docs** | http://localhost:8000/docs | - |
| **MinIO Console** | http://localhost:9001 | minioadmin / minioadmin |
| **Mailpit Web UI** | http://localhost:8025 | - |

---

## 🔐 Roles & Demo Accounts

| Role | Email | Password | Scope |
| --- | --- | --- | --- |
| **Founder** | `founder@gclms.local` | `ChangeMe123!` | Cross-School Admin |
| **Principal** | `principal.chennai@gclms.local` | `ChangeMe123!` | School Scope |
| **Teacher** | `teacher.python.chennai@gclms.local` | `ChangeMe123!` | Class & Course Scope |
| **Student** | `student.tharun.chennai@gclms.local` | `ChangeMe123!` | Student Scope |

---

## 📂 Project Structure

```
gclms/
├── apps/
│   └── web/            # Next.js 14 Frontend
├── services/
│   ├── api/            # FastAPI Modular Monolith Backend
│   └── worker/         # Celery Background Worker
├── packages/
│   ├── ui/             # Shared UI Component package
│   └── types/          # Shared TypeScript definitions
├── docs/               # System & Architecture Docs
├── tests/              # E2E & Integration tests
└── docker-compose.yml  # Docker Compose definition (7 services)
```
