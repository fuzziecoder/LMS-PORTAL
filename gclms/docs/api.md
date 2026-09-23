# GCLMS API Specifications

## Base URL
`/api/v1`

## Response Formats

### Standard Success Response
```json
{
  "data": {},
  "meta": {
    "request_id": "uuid-v4"
  }
}
```

### Standard Paginated Response
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 100,
    "total_pages": 5
  },
  "meta": {
    "request_id": "uuid-v4"
  }
}
```

### Standard Error Response
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource.",
    "request_id": "uuid-v4",
    "details": []
  }
}
```
