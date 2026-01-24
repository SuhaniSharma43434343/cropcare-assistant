@echo off
echo 🚀 Starting CropCare AI Services...

echo.
echo 📁 Starting Backend Server (Port 5001)...
cd /d "d:\crop-care AI\cropcare-assistant\server"
start "Backend Server" cmd /k "npm start"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Starting Frontend (Port 3001)...
cd /d "d:\crop-care AI\cropcare-assistant\User"
start "Frontend" cmd /k "npm start"

echo.
echo ⏳ Waiting for frontend to start...
timeout /t 10 /nobreak >nul

echo.
echo 🧪 Testing APIs...
cd /d "d:\crop-care AI\cropcare-assistant"
node test-apis.js

echo.
echo ✅ All services started!
echo 🌐 Frontend: http://localhost:3001
echo 🔧 Backend: http://localhost:5001
echo.
echo Press any key to exit...
pause >nul