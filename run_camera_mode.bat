@echo off
echo ===================================================
echo   Smart Shelf Intelligence - Local Camera Mode
echo ===================================================
echo.
echo [0/4] Cleaning up conflicting containers...
docker-compose -f docker-compose.prod.yml down >nul 2>&1
docker-compose down >nul 2>&1

echo [1/4] Starting Databases and Frontend in Docker...
docker-compose up -d postgres mongodb redis
echo Building Dev Frontend (to ensure correct port mapping)...
docker-compose up -d --build frontend
echo.

echo [2/4] Stopping Docker Backend (to free port 8000 for local run)...
docker-compose stop backend
echo.

echo [3/4] Installing Python Dependencies...
".venv\Scripts\python.exe" -m pip install -r backend/requirements.txt
echo.

echo [4/4] Starting Local Backend with Camera Access...
echo.
echo IMPORTANT: A new window will open with the backend logs.
echo Keep this window open. Press Ctrl+C to stop.
echo.

cd backend
set VIDEO_SOURCE=0
set DATABASE_URL=postgresql://ssis_user:ssis_password_2024@localhost:5432/ssis_inventory
set MONGODB_URL=mongodb://ssis_admin:ssis_mongo_2024@localhost:27018/ssis_events?authSource=admin
set REDIS_URL=redis://localhost:6379

..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
