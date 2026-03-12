import logging
from collections.abc import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class Base(DeclarativeBase):
    pass


# ── Engine ────────────────────────────────────────────────────────────────────
# pool_pre_ping: Before handing a connection to the application, SQLAlchemy
#   emits a lightweight "SELECT 1" to confirm the connection is still alive.
#   This transparently recovers from connections killed by the server (e.g.
#   after a network hiccup or a PostgreSQL idle-connection timeout).
# pool_size / max_overflow: Persistent connections kept in the pool and the
#   maximum burst capacity above that baseline.
# pool_recycle: Force-retire connections older than this many seconds so that
#   they are never reused past the server's own connection timeout.
# pool_timeout: Raise immediately after this many seconds if every connection
#   in the pool is busy, surfacing back-pressure rather than hanging a request.
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=settings.db_pool_size,
    max_overflow=settings.db_max_overflow,
    pool_recycle=settings.db_pool_recycle_seconds,
    pool_timeout=settings.db_pool_timeout,
)

# sessionmaker produces Session objects bound to the engine above.
# autocommit=False  → explicit transaction control; call db.commit() yourself.
# autoflush=False   → prevents automatic flushes before every query, giving
#                     full control over when SQL is emitted within a request.
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, class_=Session)


# ── Startup helper ────────────────────────────────────────────────────────────
def init_db() -> None:
    """Verify DB connectivity and create all tables declared on Base.

    Called once during application startup (see main.lifespan). Two distinct
    failure modes are handled separately so the error message is precise:

    - OperationalError: PostgreSQL is unreachable (wrong host/port/credentials,
      service not running).  Fatal — the app cannot serve any request.
    - SQLAlchemyError during DDL: Schema is unreachable/misconfigured.
      Also fatal, but distinct from a network issue.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connection established.")
    except OperationalError as exc:
        logger.critical(
            "Cannot reach the database at %s:%s — %s",
            settings.postgres_host,
            settings.postgres_port,
            exc,
        )
        raise

    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified / created.")
    except SQLAlchemyError as exc:
        logger.critical("Failed to apply database schema: %s", exc)
        raise


# ── Request-scoped session dependency ─────────────────────────────────────────
def get_db() -> Generator[Session, None, None]:
    """Yield a database session and guarantee it is closed after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()