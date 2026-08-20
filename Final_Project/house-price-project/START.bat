@echo off
cd /d "%~dp0"

echo ============================================
echo   House Price Predictor - Starting Everything
echo ============================================
echo.
echo This will open two black windows:
echo   1. The backend (the "brain"/model server)
echo   2. The website
echo.
echo Please DO NOT close those windows while you use the app.
echo A browser tab will open automatically in a few seconds.
echo.
pause

start "House Price - Backend" cmd /k "cd /d "%~dp0backend" && RUN_BACKEND.bat"

echo Waiting for the backend to start...
timeout /t 12 /nobreak >nul

start "House Price - Website" cmd /k "cd /d "%~dp0frontend" && RUN_FRONTEND.bat"

echo Waiting for the website to start...
timeout /t 10 /nobreak >nul

start "" "http://localhost:5173"

echo.
echo All done! If the browser tab didn't open, go to:
echo   http://localhost:5173
echo.
pause
