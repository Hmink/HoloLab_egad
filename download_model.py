"""Fetch Google's Hand Landmarker model once, then work entirely locally."""

import hashlib
from pathlib import Path
import urllib.request

MODEL_URL = (
    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/"
    "hand_landmarker/float16/1/hand_landmarker.task"
)
DEST = Path(__file__).resolve().parent / "models" / "hand_landmarker.task"
EXPECTED_SHA256 = "fbc2a30080c3c557093b5ddfc334698132eb341044ccee322ccf8bcf3607cde1"


def verified(path):
    return (
        path.is_file()
        and hashlib.sha256(path.read_bytes()).hexdigest() == EXPECTED_SHA256
    )


def main():
    if verified(DEST):
        print(f"Đã có model: {DEST}")
        return
    DEST.parent.mkdir(exist_ok=True)
    temp = DEST.with_suffix(".part")
    try:
        with urllib.request.urlopen(MODEL_URL, timeout=30) as response:
            with temp.open("wb") as out:
                while chunk := response.read(1024 * 1024):
                    out.write(chunk)
        if temp.stat().st_size < 1_000_000:
            raise ValueError("Tệp tải về nhỏ bất thường; không dùng làm model.")
        if not verified(temp):
            raise ValueError("SHA256 model không khớp phiên bản đã kiểm thử; dừng tải.")
        temp.replace(DEST)
    finally:
        temp.unlink(missing_ok=True)
    print(f"Đã tải: {DEST}")
    print("SHA256:", hashlib.sha256(DEST.read_bytes()).hexdigest())


if __name__ == "__main__":
    main()
