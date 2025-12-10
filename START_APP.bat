@echo off
REM Coffee Shop Management System - Startup Script

echo ========================================
echo Coffee Shop Management System
echo ========================================
echo.

REM Start Backend
echo Starting Backend (Port 3000)...
start "Backend" cmd /k cd /d e:\UDA\NodeJS\coffee-backend-full\backend && npm run start:dev

REM Wait for backend to start
timeout /t 5 /nobreak

REM Start Frontend
echo.
echo Starting Frontend (Port 5173)...
start "Frontend" cmd /k cd /d e:\UDA\NodeJS\coffee-backend-full\frontend && npm start

REM Wait for frontend to start
timeout /t 5 /nobreak

echo.
echo ========================================
echo Application Started Successfully
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Login with:
echo   Username: admin
echo   Password: admin123
echo.
echo Close this window to stop the startup script.
pause
