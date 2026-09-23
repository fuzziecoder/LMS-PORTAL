# GCLMS Security Architecture

## Highlights
- **Password Hashing**: Argon2id
- **Session Tokens**: JWT stored in HTTP-Only, SameSite cookies
- **Tenant Scope Enforcement**: Multi-layer backend validation on every DB query
- **Rate Limiting**: Redis token-bucket algorithm on auth endpoints
- **Input Sanitization**: Pydantic v2 schemas and strict SQL parameterization
