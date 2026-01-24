const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

async function testWeatherAPI() {
  console.log('🌤️  Testing Weather API...');
  
  try {
    // Test weather by coordinates (Mumbai)
    const coordsResponse = await axios.get(`${BASE_URL}/api/weather/forecast/coords/19.0760/72.8777`);
    console.log('✅ Weather by coordinates:', coordsResponse.data.success ? 'SUCCESS' : 'FAILED');
    
    // Test weather by city
    const cityResponse = await axios.get(`${BASE_URL}/api/weather/forecast/Mumbai`);
    console.log('✅ Weather by city:', cityResponse.data.success ? 'SUCCESS' : 'FAILED');
    
    console.log('Current weather:', cityResponse.data.data.current);
  } catch (error) {
    console.log('❌ Weather API Error:', error.message);
  }
}

async function testMandiAPI() {
  console.log('\n💰 Testing Mandi API...');
  
  try {
    // Test mandi prices
    const response = await axios.get(`${BASE_URL}/api/mandi/prices?crop=Rice&limit=5`);
    console.log('✅ Mandi API:', response.data.success ? 'SUCCESS' : 'FAILED');
    console.log('Data source:', response.data.data.source);
    console.log('Records found:', response.data.data.records.length);
    
    if (response.data.data.records.length > 0) {
      console.log('Sample record:', response.data.data.records[0]);
    }
  } catch (error) {
    console.log('❌ Mandi API Error:', error.message);
  }
}

async function testHealthAPI() {
  console.log('\n🏥 Testing Health API...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health API:', response.data.status === 'OK' ? 'SUCCESS' : 'FAILED');
    console.log('Backend:', response.data.backend);
    console.log('ML Service:', response.data.ml_service);
  } catch (error) {
    console.log('❌ Health API Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  await testHealthAPI();
  await testWeatherAPI();
  await testMandiAPI();
  
  console.log('\n✨ Tests completed!');
}

runTests();