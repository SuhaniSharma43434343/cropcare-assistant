const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const lat = 19.0760;
const lon = 72.8777;

async function testWeatherAPI() {
  console.log('Testing OpenWeather API...');
  console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 8)}...` : 'NOT SET');
  
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      { timeout: 10000 }
    );
    
    console.log('✅ Weather API Success!');
    console.log('City:', response.data.name);
    console.log('Temperature:', response.data.main.temp + '°C');
    console.log('Description:', response.data.weather[0].description);
    console.log('Humidity:', response.data.main.humidity + '%');
    
  } catch (error) {
    console.error('❌ Weather API Error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
  }
}

testWeatherAPI();