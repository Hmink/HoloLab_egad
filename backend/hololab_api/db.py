"""Database engine and sessions. PostgreSQL in production (API v3.1); SQLite works for tests and demos."""

from __future__ import annotations

from collections.abc import Iterator
from pathlib import Path

from sqlalchemy import create_engine, event, inspect
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

BACKEND = Path(__file__).resolve().parent.parent


def make_engine(url: str) -> Engine:
    if url.startswith("sqlite"):
        engine = create_engine(url, connect_args={"check_same_thread": False})

        @event.listens_for(engine, "connect")
        def _fk_on(conn, _):  # SQLite ignores foreign keys (and ON DELETE CASCADE) unless asked
            conn.execute("PRAGMA foreign_keys=ON")

        return engine
    return create_engine(url, pool_pre_ping=True)


def make_sessionmaker(engine: Engine) -> sessionmaker[Session]:
    return sessionmaker(engine, expire_on_commit=False)


def alembic_config(url: str):
    from alembic.config import Config

    cfg = Config(str(BACKEND / "alembic.ini"))
    cfg.set_main_option("script_location", str(BACKEND / "migrations"))
    cfg.attributes["database_url"] = url  # env.py reads this; avoids %-escaping in set_main_option
    return cfg


def migrate(url: str) -> None:
    """Create or upgrade all tables (alembic upgrade head)."""
    from alembic import command

    command.upgrade(alembic_config(url), "head")


def schema_problem(engine: Engine) -> str | None:
    """None when the database is reachable and migrated to the latest version, else a short reason."""
    from alembic.runtime.migration import MigrationContext
    from alembic.script import ScriptDirectory

    try:
        with engine.connect() as conn:
            current = MigrationContext.configure(conn).get_current_revision()
            tables = set(inspect(conn).get_table_names())
    except Exception as error:  # noqa: BLE001 - report any driver error as text
        return f"không kết nối được cơ sở dữ liệu ({type(error).__name__}: {str(error).splitlines()[0][:160]})"
    head = ScriptDirectory.from_config(alembic_config("")).get_current_head()
    if current != head or "users" not in tables:
        return f"cơ sở dữ liệu chưa ở phiên bản mới nhất ({current or 'trống'} → {head}). Chạy: python manage.py migrate"
    return None


def session_scope(factory: sessionmaker[Session]) -> Iterator[Session]:
    db = factory()
    try:
        yield db
    finally:
        db.close()
