@echo off
echo 🔐 Testing CropCare AI Authentication Flow...

echo.
echo 📋 Test Checklist:
echo ✓ Backend server running on port 5001
echo ✓ Frontend server running on port 3001
echo ✓ Authentication endpoints working
echo ✓ Navigation after login/signup
echo ✓ Protected routes working
echo ✓ Token storage and validation

echo.
echo 🧪 Running Backend Authentication Tests...
cd /d "d:\crop-care AI\cropcare-assistant"
node test-auth.js

echo.
echo 🌐 Frontend should be accessible at: http://localhost:3001
echo 🔧 Backend API at: http://localhost:5001

echo.
echo 📝 Manual Testing Steps:
echo 1. Open http://localhost:3001 in browser
echo 2. Should redirect to /auth if not logged in
echo 3. Try signing up with phone: 1234567890, password: test123
echo 4. Should show success message and redirect to /dashboard
echo 5. Try logging out and logging back in
echo 6. Should redirect to dashboard after successful login

echo.
echo 🔍 Common Issues to Check:
echo - CORS errors in browser console
echo - Network errors (check if backend is running)
echo - Token storage in localStorage
echo - Proper navigation after auth

echo.
echo Press any key to continue...
pause >nul