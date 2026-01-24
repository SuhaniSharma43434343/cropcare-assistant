@echo off
echo 🔍 Diagnosing MongoDB Connection Issue...

echo.
echo 📋 Checking MongoDB Connection...
cd /d "d:\crop-care AI\cropcare-assistant\server"
node test-db-connection.js

echo.
echo 🔧 Possible Solutions:
echo 1. Check internet connection
echo 2. Verify MongoDB Atlas cluster is running
echo 3. Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for testing)
echo 4. Verify credentials in .env file

echo.
echo 🚀 Restarting Backend Server...
echo Press Ctrl+C to stop the server when it starts
npm start

pause