from datetime import UTC, datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import User

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def _credentials_exception() -> HTTPException:
    """Always returns a fresh 401 exception — avoids shared mutable singleton."""
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    subject: str, expires_delta: timedelta | None = None
) -> tuple[str, int]:
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.access_token_expire_minutes)

    expire_at = datetime.now(UTC) + expires_delta
    payload = {
        "sub": subject,
        "exp": expire_at,
    }
    encoded_jwt = jwt.encode(
        payload, settings.secret_key, algorithm=settings.jwt_algorithm
    )
    return encoded_jwt, int(expires_delta.total_seconds())


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency — decodes the Bearer token and returns the authenticated user.

    Raises:
        401 if the token is invalid, expired, or the user does not exist.
        403 if the user account is inactive.
    """
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        email: str | None = payload.get("sub")
        if not email:
            raise _credentials_exception()
    except JWTError as exc:
        raise _credentials_exception() from exc

    user = db.scalar(select(User).where(User.email == email))
    if not user:
        raise _credentials_exception()

    # Guard against deactivated accounts
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )

    return user
