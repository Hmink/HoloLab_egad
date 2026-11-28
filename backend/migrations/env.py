"""Alembic environment: migrations run against HOLOLAB_DATABASE_URL (or the URL passed by manage.py/tests)."""

import os

from alembic import context
from sqlalchemy import pool

from hololab_api.db import make_engine
from hololab_api.models import Base

config = context.config
target_metadata = Base.metadata


def url() -> str:
    value = config.attributes.get("database_url") or os.environ.get("HOLOLAB_DATABASE_URL")
    if not value:
        raise SystemExit("Thiếu HOLOLAB_DATABASE_URL (xem backend/.env.example)")
    return value


def run_offline() -> None:
    context.configure(url=url(), target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_online() -> None:
    engine = make_engine(url())
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, render_as_batch=connection.dialect.name == "sqlite")
        with context.begin_transaction():
            context.run_migrations()
    engine.dispose()


if context.is_offline_mode():
    run_offline()
else:
    run_online()
