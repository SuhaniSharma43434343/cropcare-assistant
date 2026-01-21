@echo off
echo Starting CropCare Assistant...

echo.
echo [1/3] Killing any existing processes on ports 5001 and 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1

echo.
echo [2/3] Starting Backend Server on port 5001...
cd server
start "Backend Server" cmd /k "node test-server.js"
cd ..

echo.
echo [3/3] Starting Frontend on port 3001...
cd User
start "Frontend" cmd /k "npm start"
cd ..

echo.
echo ✅ CropCare Assistant is starting up!
echo 📱 Frontend: http://localhost:3001
echo 🔧 Backend: http://localhost:5001
echo.
echo Press any key to exit...
pause >nul