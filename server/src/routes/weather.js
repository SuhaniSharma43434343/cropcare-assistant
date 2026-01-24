const express = require('express');
const axios = require('axios');
const router = express.Router();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_ONECALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';

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

    // Get coordinates for the city first
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!geoResponse.data || geoResponse.data.length === 0) {
      throw new Error('City not found');
    }
    
    const { lat, lon } = geoResponse.data[0];
    
    // Use OneCall API for better data
    const oneCallResponse = await axios.get(
      `${OPENWEATHER_ONECALL_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&exclude=minutely,alerts`
    );

    const data = oneCallResponse.data;

    res.json({
      success: true,
      data: {
        current: {
          temperature: Math.round(data.current.temp),
          description: data.current.weather[0].description,
          icon: data.current.weather[0].icon,
          humidity: data.current.humidity,
          windSpeed: Math.round(data.current.wind_speed || 0),
          city: geoResponse.data[0].name,
          country: geoResponse.data[0].country
        },
        forecast: data.hourly.slice(0, 8).map(item => ({
          time: new Date(item.dt * 1000).toISOString().slice(0, 19).replace('T', ' '),
          temperature: Math.round(item.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.humidity
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

// Get weather by coordinates using OneCall API 3.0
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

    // Use OneCall API 3.0 for better data
    const oneCallResponse = await axios.get(
      `${OPENWEATHER_ONECALL_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&exclude=minutely,alerts`
    );

    const data = oneCallResponse.data;
    
    // Get location name from reverse geocoding
    let locationName = 'Your Location';
    try {
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );
      if (geoResponse.data && geoResponse.data.length > 0) {
        locationName = geoResponse.data[0].name;
      }
    } catch (geoError) {
      console.log('Geocoding failed, using default location name');
    }

    res.json({
      success: true,
      data: {
        current: {
          temperature: Math.round(data.current.temp),
          description: data.current.weather[0].description,
          icon: data.current.weather[0].icon,
          humidity: data.current.humidity,
          windSpeed: Math.round(data.current.wind_speed || 0),
          city: locationName,
          country: 'IN'
        },
        forecast: data.hourly.slice(0, 8).map(item => ({
          time: new Date(item.dt * 1000).toISOString().slice(0, 19).replace('T', ' '),
          temperature: Math.round(item.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.humidity
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