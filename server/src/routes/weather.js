const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get current weather and forecast
router.get('/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;

    // For development: return mock data if API key is not configured
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_ACTUAL_API_KEY_HERE') {
      console.log('Weather API key not configured, returning mock data for development');
      return res.json({
        success: true,
        data: {
          current: {
            temperature: 28,
            description: 'Partly cloudy',
            icon: '02d',
            humidity: 65,
            windSpeed: 12,
            city: city || 'Mumbai',
            country: 'IN'
          },
          forecast: [
            { time: '2026-01-22 15:00:00', temperature: 28, description: 'Partly cloudy', icon: '02d', humidity: 65 },
            { time: '2026-01-22 18:00:00', temperature: 26, description: 'Clear sky', icon: '01d', humidity: 60 },
            { time: '2026-01-22 21:00:00', temperature: 24, description: 'Clear sky', icon: '01n', humidity: 70 },
            { time: '2026-01-23 00:00:00', temperature: 22, description: 'Clear sky', icon: '01n', humidity: 75 },
            { time: '2026-01-23 03:00:00', temperature: 21, description: 'Clear sky', icon: '01n', humidity: 80 },
            { time: '2026-01-23 06:00:00', temperature: 23, description: 'Sunny', icon: '01d', humidity: 70 },
            { time: '2026-01-23 09:00:00', temperature: 26, description: 'Sunny', icon: '01d', humidity: 65 },
            { time: '2026-01-23 12:00:00', temperature: 29, description: 'Partly cloudy', icon: '02d', humidity: 60 }
          ]
        }
      });
    }

    // Get current weather
    const currentWeatherResponse = await axios.get(
      `${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    // Get 5-day forecast
    const forecastResponse = await axios.get(
      `${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const currentWeather = currentWeatherResponse.data;
    const forecast = forecastResponse.data;

    res.json({
      success: true,
      data: {
        current: {
          temperature: Math.round(currentWeather.main.temp),
          description: currentWeather.weather[0].description,
          icon: currentWeather.weather[0].icon,
          humidity: currentWeather.main.humidity,
          windSpeed: currentWeather.wind.speed,
          city: currentWeather.name,
          country: currentWeather.sys.country
        },
        forecast: forecast.list.slice(0, 8).map(item => ({
          time: item.dt_txt,
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity
        }))
      }
    });

  } catch (error) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data'
    });
  }
});

// Get weather by coordinates
router.get('/forecast/coords/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;

    // For development: return mock data if API key is not configured
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_ACTUAL_API_KEY_HERE') {
      console.log('Weather API key not configured, returning mock data for development');
      return res.json({
        success: true,
        data: {
          current: {
            temperature: 27,
            description: 'Sunny',
            icon: '01d',
            humidity: 55,
            windSpeed: 8,
            city: 'Your Location',
            country: 'IN'
          },
          forecast: [
            { time: '2026-01-22 15:00:00', temperature: 27, description: 'Sunny', icon: '01d', humidity: 55 },
            { time: '2026-01-22 18:00:00', temperature: 25, description: 'Clear sky', icon: '01d', humidity: 60 },
            { time: '2026-01-22 21:00:00', temperature: 23, description: 'Clear sky', icon: '01n', humidity: 65 },
            { time: '2026-01-23 00:00:00', temperature: 21, description: 'Clear sky', icon: '01n', humidity: 70 },
            { time: '2026-01-23 03:00:00', temperature: 20, description: 'Clear sky', icon: '01n', humidity: 75 },
            { time: '2026-01-23 06:00:00', temperature: 22, description: 'Sunny', icon: '01d', humidity: 65 },
            { time: '2026-01-23 09:00:00', temperature: 25, description: 'Sunny', icon: '01d', humidity: 60 },
            { time: '2026-01-23 12:00:00', temperature: 28, description: 'Partly cloudy', icon: '02d', humidity: 55 }
          ]
        }
      });
    }

    const currentWeatherResponse = await axios.get(
      `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const forecastResponse = await axios.get(
      `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const currentWeather = currentWeatherResponse.data;
    const forecast = forecastResponse.data;

    res.json({
      success: true,
      data: {
        current: {
          temperature: Math.round(currentWeather.main.temp),
          description: currentWeather.weather[0].description,
          icon: currentWeather.weather[0].icon,
          humidity: currentWeather.main.humidity,
          windSpeed: currentWeather.wind.speed,
          city: currentWeather.name,
          country: currentWeather.sys.country
        },
        forecast: forecast.list.slice(0, 8).map(item => ({
          time: item.dt_txt,
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity
        }))
      }
    });

  } catch (error) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data'
    });
  }
});

module.exports = router;