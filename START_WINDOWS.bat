@echo off
setlocal
cd /d "%~dp0"
title HoloLab AR V3.9
if exist .venv\Scripts\python.exe (
  .venv\Scripts\python.exe server.py
  goto done
)
py -3.13 -c "import sys" >nul 2>&1
if not errorlevel 1 (
  py -3.13 server.py
  goto done
)
python -c "import sys; assert sys.version_info >= (3,10)" >nul 2>&1
if not errorlevel 1 (
  python server.py
  goto done
)
echo Can Python 3.10 tro len. Khuyen dung Python 3.13 da cai tren may.
echo Mo PowerShell tai thu muc nay va thu: py -3.13 server.py
:done
pause
