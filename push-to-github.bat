@echo off
echo 🚀 Pushing CropCare AI Changes to GitHub...

cd /d "d:\crop-care AI\cropcare-assistant"

echo.
echo 📋 Staging all changes...
git add .

echo.
echo 💾 Committing changes...
git commit -m "🔧 Major Updates: Fixed Authentication, Weather API, and Database Connection

✅ Authentication System:
- Fixed sign up/sign in navigation issues
- Added proper redirect to dashboard after auth
- Implemented local fallback authentication
- Enhanced error handling and user feedback
- Added loading states and form validation

✅ Weather API Integration:
- Updated to OpenWeatherMap OneCall API 3.0
- Added geolocation-based weather detection
- Improved error handling with fallback data
- Enhanced weather data structure

✅ Market Price API:
- Fixed mandi API integration
- Added government data source with fallback
- Improved error handling and data presentation

✅ Database Connection:
- Fixed MongoDB connection issues
- Added local authentication fallback
- Improved connection options and error handling
- Updated connection string configuration

✅ Code Structure:
- Restructured App.js routing system
- Enhanced protected route implementation
- Improved component organization
- Added comprehensive error handling

✅ Testing & Documentation:
- Added authentication test scripts
- Created database connection tests
- Updated documentation and setup guides
- Added troubleshooting scripts"

echo.
echo 📤 Pushing to GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Successfully pushed all changes to GitHub!
    echo 🌐 Your repository is now updated with all the latest fixes
) else (
    echo.
    echo ❌ Push failed. Possible issues:
    echo 1. Check if you're connected to the internet
    echo 2. Verify GitHub credentials
    echo 3. Make sure you have push permissions
    echo.
    echo 🔧 Try these commands manually:
    echo git add .
    echo git commit -m "Updated CropCare AI with authentication and API fixes"
    echo git push origin main
)

echo.
echo Press any key to continue...
pause >nul