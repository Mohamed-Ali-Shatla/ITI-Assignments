@echo off
setlocal
cd /d "%~dp0"

echo ============================================
echo   House Price Predictor - Website
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js was not found on this computer.
    echo Please install it - the LTS version - from:
    echo   https://nodejs.org
    echo Then close this window and double-click this file again.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing dependencies ^(first run only, can take a minute^)...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] "npm install" failed. Check the messages above.
        pause
        exit /b 1
    )
)

if not exist ".env" copy ".env.example" ".env" >nul

echo.
echo ============================================
echo  Website starting on http://localhost:5173
echo  KEEP THIS WINDOW OPEN while you use the app.
echo  Close this window (or press CTRL+C) to stop it.
echo ============================================
echo.
call npm run dev

pause
