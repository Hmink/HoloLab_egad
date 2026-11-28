"""Errors in the v3.1 shape: {"error": "<tiếng Việt>", "error_code": "...", "retryable": bool, ...}.

The frontend relies only on error_code/retryable, never on the message text."""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

NO_STORE = {"Cache-Control": "no-store"}


class ApiError(Exception):
    def __init__(self, status: int, code: str, message: str, retryable: bool = False, headers: dict | None = None, **extra):
        super().__init__(message)
        self.status, self.code, self.message, self.retryable = status, code, message, retryable
        self.headers, self.extra = headers or {}, extra

    def response(self) -> JSONResponse:
        body = {"error": self.message, "error_code": self.code, "retryable": self.retryable, **self.extra}
        return JSONResponse(body, status_code=self.status, headers={**NO_STORE, **self.headers})


def invalid_field(field: str, message: str) -> ApiError:
    return ApiError(400, "invalid_field", message, details={"field": field})


def install(app: FastAPI) -> None:
    @app.exception_handler(ApiError)
    async def _api(_: Request, exc: ApiError):
        return exc.response()

    @app.exception_handler(RequestValidationError)
    async def _validation(_: Request, exc: RequestValidationError):
        errors = exc.errors()
        loc = [str(p) for p in (errors[0].get("loc") or ()) if p != "body"] if errors else []
        kind = errors[0].get("type") if errors else ""
        if kind == "extra_forbidden":
            return ApiError(400, "invalid_input", f"Trường không được phép: {'.'.join(loc)}", details={"field": ".".join(loc)}).response()
        if loc:
            return ApiError(400, "invalid_field", "Thông tin chưa hợp lệ.", details={"field": ".".join(loc)}).response()
        return ApiError(400, "invalid_input", "Yêu cầu không hợp lệ (cần JSON đúng định dạng).").response()

    @app.exception_handler(StarletteHTTPException)
    async def _http(_: Request, exc: StarletteHTTPException):
        if exc.status_code == 404:
            return ApiError(404, "not_found", "Không tìm thấy.").response()
        if exc.status_code == 405:
            return ApiError(405, "method_not_allowed", "Phương thức không được hỗ trợ.").response()
        return ApiError(exc.status_code, "http_error", str(exc.detail)).response()
