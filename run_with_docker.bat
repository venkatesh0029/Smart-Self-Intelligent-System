@echo off
echo Starting Smart Shelf Intelligence System via Docker...

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not running or not installed.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

:: Create .env if not exists (already done by agent, but good practice)
if not exist backend\.env (
    echo Creating default backend/.env...
    copy .env.example backend\.env
)

:: Build and Start Services
echo Building and starting containers...
docker-compose up --build -d

echo.
echo ===================================================
echo System Started Successfully!
echo ===================================================
echo Frontend Dashboard: http://localhost:3000
echo Backend API Docs:   http://localhost:8000/docs
echo.
echo Use 'docker-compose logs -f' to view logs.
echo ===================================================
pause
