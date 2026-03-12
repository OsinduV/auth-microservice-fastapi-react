from functools import lru_cache

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Auth Service"
    environment: str = "development"

    # ── PostgreSQL connection parameters ──────────────────────────────────────
    # Each variable maps directly to a POSTGRES_* environment variable, making
    # the config block self-documenting and compatible with Docker Compose
    # `environment:` sections without any manual URL assembly outside Python.
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "authdb"
    postgres_user: str = "postgres"
    postgres_password: str = "postgres"

    secret_key: str = "CHANGE_ME_IN_PRODUCTION"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    db_pool_size: int = 10
    db_max_overflow: int = 20
    db_pool_recycle_seconds: int = 1800
    db_pool_timeout: int = 30  # Seconds to wait for a free connection before raising.

    cors_origins: str = "*"

    model_config = SettingsConfigDict(
        env_file=".env",           # Load values from .env when present.
        env_file_encoding="utf-8",
        extra="ignore",            # Silently discard unrecognised env vars.
    )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def database_url(self) -> str:
        """Build the SQLAlchemy connection URL from individual POSTGRES_* vars.

        Uses the `postgresql+psycopg` dialect which targets psycopg3 — the
        current-generation driver with native SQLAlchemy 2.0 support.
        The URL is assembled here so that individual secrets can be supplied
        as separate environment variables (standard Docker/K8s practice) rather
        than requiring callers to pre-build a connection string.
        """
        return (
            f"postgresql+psycopg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()

# ********* Later: move SECRET_KEY into .env.

# How Pydantic BaseSettings Works, When your app runs, Pydantic checks in this order: 
# 1. Environment Variables: It looks for environment variables that match the field names in your Settings class. For example, if you have a field named `app_name`, it will look for an environment variable named `APP_NAME`. If it finds one, it will use that value.
# 2. .env File: If it doesn't find an environment variable, it will look for a .env file in the current directory (or the directory specified by `env_file` in the model config). If it finds a .env file, it will read the key-value pairs from that file and use them to populate the settings fields.
# 3. Default Values: If it doesn't find an environment variable or a .env file, it will use the default values specified in the Settings class. For example, if you have `app_name: str = "Auth Service"`, it will use "Auth Service" as the default value for `app_name` if no environment variable or .env value is provided.

# (Pydantic BaseSettings Behavior) By default, Pydantic matches environment variables to settings fields by converting the field name to uppercase and replacing any non-alphanumeric characters with underscores. So, for example, the `app_name` field can be set using the `APP_NAME` environment variable, and `database_url` can be set using `DATABASE_URL`. This allows you to easily configure your application using environment variables without needing to change the code.

# lru_cache = Least Recently Used cache, used here to ensure that the Settings instance is created only once and reused across the application, improving performance by avoiding redundant parsing of environment variables.
# without lru_cache, every call to get_settings() would create a new instance of Settings, which is unnecessary and inefficient since the configuration typically does not change during runtime.