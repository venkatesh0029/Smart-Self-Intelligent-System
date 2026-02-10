@echo off
echo Starting Smart Shelf Intelligence System (PRODUCTION)...

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not running.
    pause
    exit /b 1
)

echo Building and starting production containers...
docker-compose -f docker-compose.prod.yml up --build -d

echo.
echo ===================================================
echo Production System Started!
echo ===================================================
echo Dashboard: http://localhost
echo API:       http://localhost/api/docs
echo.
echo Use 'docker-compose -f docker-compose.prod.yml logs -f' to view logs.
echo ===================================================
pause
