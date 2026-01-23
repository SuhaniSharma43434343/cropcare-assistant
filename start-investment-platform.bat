@echo off
echo ========================================
echo    CropCare AI Investment Platform
echo ========================================
echo.

echo 📊 Creating sample investment data...
node create-sample-investment-data.js
echo.

echo 🚀 Starting all services...
echo.

echo 🐍 Starting Python ML Service (Port 5000)...
start "Python ML Service" cmd /k "cd python-ml-service && python app.py"
timeout /t 3 /nobreak > nul

echo 🟢 Starting Node.js Backend (Port 5001)...
start "Node.js Backend" cmd /k "cd server && npm start"
timeout /t 3 /nobreak > nul

echo ⚛️  Starting React Frontend (Port 3001)...
start "React Frontend" cmd /k "cd User && npm start"
timeout /t 2 /nobreak > nul

echo.
echo ✅ All services started!
echo.
echo 🌐 Access the application:
echo    Frontend: http://localhost:3001
echo    Backend:  http://localhost:5001
echo    ML Service: http://localhost:5000
echo.
echo 💡 Investment Platform Features:
echo    • Farmer Flow: Create funding requests, manage notifications
echo    • Investor Flow: Browse opportunities, express interest
echo    • Real-time notifications and status updates
echo    • Responsive design for mobile and desktop
echo.
echo Press any key to exit...
pause > nul