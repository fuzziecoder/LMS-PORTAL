# GCLMS Deployment Guide

## Local Development Deployment
Using Docker Compose:
```bash
make setup
```

## Production Deployment Principles
- Frontend deployed on Vercel / Next.js Node container
- Backend API deployed on AWS ECS / Kubernetes / Railway / Render
- Managed PostgreSQL 16 (AWS RDS)
- Managed Redis (AWS ElastiCache)
- AWS S3 for object storage
