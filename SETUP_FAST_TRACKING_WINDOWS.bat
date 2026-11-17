@echo off
setlocal
cd /d "%~dp0"
py -3.13 -c "import sys" >nul 2>&1
if errorlevel 1 (
  echo Can cai Python 3.13 truoc khi cai bo tracking Python.
  goto done
)
if not exist .venv\Scripts\python.exe py -3.13 -m venv .venv
if errorlevel 1 goto done
.venv\Scripts\python.exe -m pip install -r requirements-tracking.txt
if errorlevel 1 goto done
echo Da cai. Chay START_WINDOWS.bat, chon Tracking Python CPU neu can.
:done
pause
