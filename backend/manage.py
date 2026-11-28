"""Server-side admin commands for the v3.1 database (run in backend/, with HOLOLAB_DATABASE_URL in .env).

  python manage.py migrate                      create/upgrade tables
  python manage.py create-teacher <username>    teacher account (no public sign-up for teachers)
  python manage.py set-password <username>      new password for any account (e.g. a teacher who forgot it)
  python manage.py set-active <username> on|off lock or unlock an account

Passwords are typed twice without echo, or read from stdin with --password-stdin (one line), so they never
appear in the shell history or the process list."""

from __future__ import annotations

import argparse
import getpass
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from envfile import load_dotenv  # noqa: E402


def _url() -> str:
    import os

    load_dotenv(ROOT / ".env")
    url = os.environ.get("HOLOLAB_DATABASE_URL")
    if not url:
        raise SystemExit("Thiếu HOLOLAB_DATABASE_URL trong backend/.env (xem .env.example).")
    return url


def _password(args, username: str) -> str:
    from hololab_api.errors import ApiError
    from hololab_api.security import check_new_password

    if args.password_stdin:
        password = sys.stdin.readline().rstrip("\n")
    else:
        password = getpass.getpass("Mật khẩu mới: ")
        if getpass.getpass("Nhập lại: ") != password:
            raise SystemExit("Hai mật khẩu không khớp.")
    try:
        return check_new_password(password, username)
    except ApiError as error:
        raise SystemExit(error.message) from None


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("migrate", help="tạo/cập nhật bảng")
    for name in ("create-teacher", "set-password"):
        p = sub.add_parser(name)
        p.add_argument("username")
        p.add_argument("--password-stdin", action="store_true", help="đọc mật khẩu từ một dòng stdin")
    p = sub.add_parser("set-active")
    p.add_argument("username")
    p.add_argument("state", choices=("on", "off"))
    args = parser.parse_args(argv)

    url = _url()
    from hololab_api.db import make_engine, migrate

    if args.command == "migrate":
        migrate(url)
        print("Đã cập nhật cơ sở dữ liệu lên phiên bản mới nhất.")
        return 0

    engine = make_engine(url)
    try:  # always release the connections: on Windows an open SQLite file cannot be deleted or replaced
        return _account_command(args, engine)
    finally:
        engine.dispose()


def _account_command(args, engine) -> int:
    from sqlalchemy import select

    from hololab_api.db import make_sessionmaker
    from hololab_api.errors import ApiError
    from hololab_api.models import AuthSession, User
    from hololab_api.security import check_username, hash_password

    with make_sessionmaker(engine)() as db:
        try:
            username = check_username(args.username.strip().lower())
        except ApiError as error:
            raise SystemExit(error.message) from None
        user = db.scalar(select(User).where(User.username == username))
        if args.command == "create-teacher":
            if user:
                raise SystemExit(f"Tên đăng nhập '{username}' đã tồn tại.")
            db.add(User(username=username, password_hash=hash_password(_password(args, username)), role="teacher"))
            db.commit()
            print(f"Đã tạo tài khoản giáo viên '{username}'.")
            return 0
        if user is None:
            raise SystemExit(f"Không có tài khoản '{username}'.")
        if args.command == "set-password":
            user.password_hash = hash_password(_password(args, username))
            message = f"Đã đặt mật khẩu mới cho '{username}'; các phiên đăng nhập cũ bị đăng xuất."
        else:
            user.active = args.state == "on"
            message = f"Đã {'mở khóa' if user.active else 'khóa'} tài khoản '{username}'."
        db.query(AuthSession).filter(AuthSession.user_id == user.id).delete()  # sign out everywhere
        db.commit()
        print(message)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
