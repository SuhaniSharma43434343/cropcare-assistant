const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get current weather and forecast
router.get('/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweather_api_key_here') {
      console.log('Weather API key not configured, returning mock data');
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
            { time: new Date().toISOString().slice(0, 19).replace('T', ' '), temperature: 28, description: 'Partly cloudy', icon: '02d', humidity: 65 },
            { time: new Date(Date.now() + 3*3600000).toISOString().slice(0, 19).replace('T', ' '), temperature: 26, description: 'Clear sky', icon: '01d', humidity: 60 },
            { time: new Date(Date.now() + 6*3600000).toISOString().slice(0, 19).replace('T', ' '), temperature: 24, description: 'Clear sky', icon: '01n', humidity: 70 },
            { time: new Date(Date.now() + 9*3600000).toISOString().slice(0, 19).replace('T', ' '), temperature: 22, description: 'Clear sky', icon: '01n', humidity: 75 }
          ]
        }
      });
    }

    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      axios.get(`${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`),
      axios.get(`${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`)
    ]);

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
          windSpeed: Math.round(currentWeather.wind?.speed || 0),
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
    console.error('Weather API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.response?.data?.message || error.message
    });
  }
});

// Get weather by coordinates
router.get('/forecast/coords/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweather_api_key_here') {
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
            { time: new Date().toISOString().slice(0, 19).replace('T', ' '), temperature: 27, description: 'Sunny', icon: '01d', humidity: 55 },
            { time: new Date(Date.now() + 3*3600000).toISOString().slice(0, 19).replace('T', ' '), temperature: 25, description: 'Clear sky', icon: '01d', humidity: 60 },
            { time: new Date(Date.now() + 6*3600000).toISOString().slice(0, 19).replace('T', ' '), temperature: 23, description: 'Clear sky', icon: '01n', humidity: 65 },
            { time: new Date(Date.now() + 9*3600000).toISOString().slice(0, 19).replace('T', ' '), temperature: 21, description: 'Clear sky', icon: '01n', humidity: 70 }
          ]
        }
      });
    }

    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      axios.get(`${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`),
      axios.get(`${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`)
    ]);

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
          windSpeed: Math.round(currentWeather.wind?.speed || 0),
          city: currentWeather.name || 'Unknown',
          country: currentWeather.sys?.country || 'IN'
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
    console.error('Weather API Error:', error.response?.data || error.message);
    
    // Return fallback data instead of error
    res.json({
      success: true,
      data: {
        current: {
          temperature: 25,
          description: 'Weather unavailable',
          icon: '01d',
          humidity: 60,
          windSpeed: 5,
          city: 'Location',
          country: 'IN'
        },
        forecast: [
          { time: new Date().toISOString().slice(0, 19).replace('T', ' '), temperature: 25, description: 'Weather unavailable', icon: '01d', humidity: 60 }
        ]
      }
    });
  }
});

module.exports = router;