@echo off
echo Starting CropCare Assistant with all services...

echo.
echo [1/4] Killing existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1

echo.
echo [2/4] Starting Python ML Service on port 8000...
cd python-ml-service
start "Python ML Service" cmd /k "pip install -r requirements.txt && python app.py"
cd ..

timeout /t 3 >nul

echo.
echo [3/4] Starting Backend Server on port 5000...
cd server
start "Backend Server" cmd /k "npm install && node src/server.js"
cd ..

timeout /t 3 >nul

echo.
echo [4/4] Starting Frontend on port 3001...
cd User
start "Frontend" cmd /k "npm install && npm start"
cd ..

echo.
echo ✅ All services starting up!
echo 🐍 Python ML Service: http://localhost:8000
echo 🔧 Backend API: http://localhost:5000
echo 📱 Frontend: http://localhost:3001
echo.
echo Press any key to exit...
pause >nul