@echo off
echo ========================================================
echo        STARTING FARMER E-COMMERCE FULL STACK
echo ========================================================
echo.
echo 1. Starting Backend API on http://localhost:5000 ...
start "Backend Server (Port 5000)" cmd /k "cd /d C:\Users\shanmugapriya\farmer-ecommerce\backend && node server.js"

echo 2. Starting Frontend on http://localhost:5173 ...
start "Frontend (Vite)" cmd /k "cd /d C:\Users\shanmugapriya\farmer-ecommerce\frontend && npm.cmd run dev"

echo.
echo Both Backend and Frontend are starting!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
