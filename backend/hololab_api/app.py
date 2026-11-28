"""FastAPI app for /api/v1 (API v3.1). Started inside server.py when HOLOLAB_DATABASE_URL is set, or on its
own behind a reverse proxy: uvicorn hololab_api.app:app --host 127.0.0.1 --port 8766"""

from __future__ import annotations

from dataclasses import dataclass

from fastapi import FastAPI
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from . import auth, errors
from .config import Settings, from_env
from .db import make_engine, make_sessionmaker
from .security import RateLimiter


@dataclass
class Context:
    settings: Settings
    engine: Engine
    sessions: sessionmaker[Session]
    limiter: RateLimiter


def create_app(settings: Settings | None = None, engine: Engine | None = None, limiter: RateLimiter | None = None) -> FastAPI:
    settings = settings or from_env()
    if engine is None:
        if not settings.database_url:
            raise RuntimeError("Thiếu HOLOLAB_DATABASE_URL (xem backend/.env.example)")
        engine = make_engine(settings.database_url)
    app = FastAPI(title="HoloLab API", version="3.1", docs_url=None, redoc_url=None, openapi_url=None)
    app.state.ctx = Context(settings, engine, make_sessionmaker(engine), limiter or RateLimiter())
    errors.install(app)
    app.include_router(auth.router)

    @app.middleware("http")
    async def _headers(request, call_next):
        response = await call_next(request)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        return response

    return app


def __getattr__(name):  # `uvicorn hololab_api.app:app` builds the app from the environment on demand
    if name == "app":
        from envfile import load_dotenv  # backend/envfile.py

        from .db import BACKEND

        load_dotenv(BACKEND / ".env")
        return create_app()
    raise AttributeError(name)
