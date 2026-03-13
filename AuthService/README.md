# Auth Service

FastAPI-based authentication service with PostgreSQL, JWT authentication, and SQLAlchemy ORM.

## Features

- User registration with password hashing (`bcrypt` via `passlib`)
- User login with JWT token issuance
- Protected endpoint to return the authenticated user profile
- Environment-based configuration with `pydantic-settings`
- PostgreSQL connection pooling and startup health validation
- Docker Compose support for local PostgreSQL

## Tech Stack

- Python 3.12+ (project currently contains Python 3.14 bytecode artifacts)
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL + `psycopg` (v3)
- Pydantic v2
- `python-jose` for JWT
- `passlib[bcrypt]` for password hashing

## Project Structure

```text
AuthService/
├─ app/
│  ├─ __init__.py
│  ├─ config.py       # Application settings and DB URL assembly
│  ├─ database.py     # Engine, session management, init checks
│  ├─ main.py         # FastAPI app, CORS, routes
│  ├─ models.py       # SQLAlchemy models
│  ├─ schemas.py      # Pydantic request/response schemas
│  └─ security.py     # Password hashing, JWT, current-user dependency
├─ docker-compose.yml # PostgreSQL service definition
├─ requirements.txt
└─ .env
```

## Configuration

Settings are loaded from environment variables and `.env` (via `BaseSettings`).

### Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `APP_NAME` | FastAPI app title | `Auth Service` |
| `ENVIRONMENT` | Runtime environment label | `development` |
| `POSTGRES_HOST` | PostgreSQL host | `localhost` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `POSTGRES_DB` | Database name | `authdb` |
| `POSTGRES_USER` | Database username | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `postgres` |
| `SECRET_KEY` | JWT signing key | `CHANGE_ME_IN_PRODUCTION` |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes | `30` |
| `DB_POOL_SIZE` | SQLAlchemy pool size | `10` |
| `DB_MAX_OVERFLOW` | SQLAlchemy pool overflow | `20` |
| `DB_POOL_RECYCLE_SECONDS` | Connection recycle interval | `1800` |
| `DB_POOL_TIMEOUT` | Pool wait timeout in seconds | `30` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `*` |

`database_url` is computed internally as:

`postgresql+psycopg://<user>:<password>@<host>:<port>/<db>`

## Running the Service

## 1) Install dependencies

```bash
pip install -r requirements.txt
```

## 2) Start PostgreSQL with Docker Compose

```bash
docker compose up -d db
```

Compose maps container `5432` to host `5433` by default. Ensure your `.env` has:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
```

## 3) Run the API

```bash
uvicorn app.main:app --reload
```

The app runs on `http://127.0.0.1:8000` by default.

## API Documentation UI

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Authentication Flow

### Registration

- Endpoint: `POST /auth/register`
- Input: `{ "email": "user@example.com", "password": "min-8-chars" }`
- Behavior:
  - Rejects duplicate email
  - Hashes password and stores user record
  - Returns success message

### Login

- Endpoint: `POST /auth/login`
- Input: `{ "email": "user@example.com", "password": "min-8-chars" }`
- Behavior:
  - Validates credentials
  - Returns JWT access token and expiration seconds

### Protected Route

- Endpoint: `GET /protected/me`
- Header: `Authorization: Bearer <access_token>`
- Behavior:
  - Decodes JWT
  - Resolves user by token subject (`sub = email`)
  - Returns user profile

## API Contracts

### `POST /auth/register`

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Responses:

- `201 Created`

```json
{
  "message": "Registration successful"
}
```

- `400 Bad Request`

```json
{
  "detail": "Unable to process registration"
}
```

### `POST /auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (`200 OK`):

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 1800
}
```

Error (`401 Unauthorized`):

```json
{
  "detail": "Invalid credentials"
}
```

### `GET /protected/me`

Response (`200 OK`):

```json
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2026-03-13T12:00:00Z"
}
```

Error (`401 Unauthorized`): invalid/expired token or missing user.

## Database Model

Single model: `users`

- `id` (PK, indexed)
- `email` (unique, indexed, max 320, not null)
- `hashed_password` (not null)
- `created_at` (server default `now()`, timezone-aware)

## Security Notes

- Passwords are never stored in plain text.
- JWT includes:
  - `sub`: user email
  - `exp`: expiration timestamp
- OAuth2 Bearer flow is configured with `tokenUrl=/auth/login`.
- Replace `SECRET_KEY` with a long random value in production.
- Restrict `CORS_ORIGINS` in production to trusted frontends.

## Operational Notes

- On startup, the app:
  1. Validates DB connectivity (`SELECT 1`)
  2. Creates/validates schema via `Base.metadata.create_all`
  3. Exits fast if DB init fails

- SQLAlchemy engine is configured with:
  - `pool_pre_ping=True`
  - configurable pool size/overflow/recycle/timeout

## Current Gap Identified During Analysis

`app/security.py` checks `user.is_active`, but `app/models.py` `User` model does not define `is_active`.

Potential impact:

- Any request that reaches `get_current_user` can raise an attribute error unless `is_active` is added to the model (or check is removed/adjusted).

## Suggested Next Improvements

- Add Alembic migrations for schema evolution
- Add automated tests (unit + API integration)
- Add rate limiting / brute-force protection for login
- Add refresh-token flow (optional)
- Add structured logging and request correlation IDs
