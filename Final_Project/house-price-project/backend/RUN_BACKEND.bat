@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ============================================
echo   House Price Predictor - Backend Server
echo ============================================
echo.

set "PYCMD="

REM Try to find a good Python version via the "py" launcher (3.12 is safest, then 3.11, 3.13, 3.10)
where py >nul 2>nul
if %ERRORLEVEL%==0 (
    for %%V in (3.12 3.11 3.13 3.10) do (
        if not defined PYCMD (
            py -%%V --version >nul 2>nul
            if !ERRORLEVEL!==0 (
                set "PYCMD=py -%%V"
                echo Found Python %%V - using it.
            )
        )
    )
)

REM Fall back to whatever "python" points to
if not defined PYCMD (
    python --version >nul 2>nul
    if !ERRORLEVEL!==0 (
        set "PYCMD=python"
        echo Using default "python" command.
    )
)

if not defined PYCMD (
    echo.
    echo [ERROR] Python was not found on this computer.
    echo Please install Python 3.12 from:
    echo   https://www.python.org/downloads/release/python-31210/
    echo Remember to tick "Add python.exe to PATH" during install.
    echo.
    pause
    exit /b 1
)

if not exist ".venv" (
    echo Creating a virtual environment ^(first run only^)...
    %PYCMD% -m venv .venv
)

call ".venv\Scripts\activate.bat"

echo.
echo Installing dependencies ^(first run only, can take a few minutes^)...
python -m pip install --upgrade pip --quiet
pip install --prefer-binary -r requirements.txt
if errorlevel 1 (
    echo.
    echo [ERROR] Could not install the required packages.
    echo This usually means your Python version is too new/old.
    echo Please install Python 3.12 from the link below, then delete
    echo the ".venv" folder in this backend folder and run this file again:
    echo   https://www.python.org/downloads/release/python-31210/
    echo.
    pause
    exit /b 1
)

if not exist ".env" copy ".env.example" ".env" >nul

echo.
echo ============================================
echo  Backend is starting on http://localhost:8000
echo  KEEP THIS WINDOW OPEN while you use the app.
echo  Close this window (or press CTRL+C) to stop it.
echo ============================================
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8000

pause
