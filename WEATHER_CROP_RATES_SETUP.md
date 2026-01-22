# Weather & Crop Rates Feature Setup

## Overview
Added real-time weather forecast and crop market rates features to the CropCare AI application.

## Features Added

### 1. Weather Bar
- Displays current weather conditions
- Shows 4-hour forecast
- Includes temperature, humidity, wind speed
- Updates every 5 minutes
- Responsive design with weather icons

### 2. Crop Rates Section
- Shows real-time market prices for 6 major crops
- Displays price trends (up/down/stable)
- Updates every 10 minutes
- Supports multiple cities

### 3. City Selector
- Dropdown to select different cities
- Option to use current GPS location
- Affects both weather and crop rates data

## Setup Instructions

### 1. Get OpenWeatherMap API Key
1. Visit https://openweathermap.org/
2. Sign up for a free account
3. Go to API Keys section
4. Copy your API key

### 2. Update Environment Variables
Add your API key to `server/.env`:
```
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies (if needed)
No additional dependencies required - using existing axios for API calls.

### 4. Start the Application
```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from User directory)  
npm start
```

## API Endpoints Added

### Weather API
- `GET /api/weather/forecast/:city` - Get weather for specific city
- `GET /api/weather/forecast/coords/:lat/:lon` - Get weather by coordinates

### Crop Rates API
- `GET /api/crop-rates/rates/:city` - Get all crop rates for city
- `GET /api/crop-rates/rates/:city/:crops` - Get specific crop rates

## File Structure

### Backend Files Added:
- `server/src/routes/weather.js` - Weather API routes
- `server/src/routes/cropRates.js` - Crop rates API routes

### Frontend Files Added:
- `User/src/components/WeatherBar.js` - Weather display component
- `User/src/components/CropRates.js` - Crop rates display component  
- `User/src/components/CitySelector.js` - City selection component

### Files Modified:
- `server/src/server.js` - Added new route imports
- `User/src/pages/Home.js` - Integrated new components
- `server/.env` - Added weather API key

## Features

### Weather Bar Features:
- Current temperature and conditions
- Weather description with icons
- Humidity and wind speed
- 4-hour mini forecast
- Auto-refresh every 5 minutes

### Crop Rates Features:
- Top 6 crop prices (Tomato, Potato, Wheat, Rice, Corn, Onion)
- Price trends with up/down indicators
- City-specific pricing
- Auto-refresh every 10 minutes
- INR currency display

### City Selector Features:
- 10 major Indian cities
- GPS location option
- Dropdown interface
- Affects both weather and rates

## Responsive Design
- Mobile-first approach
- Fits seamlessly above existing AI section
- Consistent with app's green theme
- Smooth animations and loading states

## Data Sources
- Weather: OpenWeatherMap API (real-time)
- Crop Rates: Mock data with realistic variations (can be replaced with real market APIs)

## Error Handling
- Graceful fallbacks for API failures
- Loading states for better UX
- Error messages for unavailable data

The features are now fully integrated and ready to use!