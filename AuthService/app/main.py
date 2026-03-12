import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db, init_db
from app.models import User
from app.schemas import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.security import create_access_token, get_current_user, get_password_hash, verify_password

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan: initialise the database before accepting traffic.

    init_db() probes the PostgreSQL connection and creates tables. If it
    raises, the exception propagates and the server process exits — a
    misconfigured database should never result in a running-but-broken app.
    """
    try:
        init_db()
    except Exception as exc:
        logger.critical("Startup aborted — database initialisation failed: %s", exc)
        raise RuntimeError("Database initialisation failed") from exc
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

cors_origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
app.add_middleware(
	CORSMiddleware,
	allow_origins=cors_origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> dict[str, str]:
	existing_user = db.scalar(select(User).where(User.email == payload.email))
	if existing_user:
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail="Unable to process registration",
		)

	user = User(email=payload.email, hashed_password=get_password_hash(payload.password))
	db.add(user)
	db.commit()

	return {"message": "Registration successful"}


@auth_router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
	user = db.scalar(select(User).where(User.email == payload.email))

	is_valid = user is not None and verify_password(payload.password, user.hashed_password)
	if not is_valid:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid credentials",
			headers={"WWW-Authenticate": "Bearer"},
		)

	token, expires_in = create_access_token(subject=user.email)
	return TokenResponse(access_token=token, expires_in=expires_in)


app.include_router(auth_router)


@app.get("/protected/me", response_model=UserResponse, tags=["protected"])
def protected_me(current_user: User = Depends(get_current_user)) -> UserResponse:
	return UserResponse.model_validate(current_user)

