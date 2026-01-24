const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

async function testAllAPIs() {
  console.log('🧪 CropCare AI - API Test Suite\n');
  
  // Health Check
  try {
    const health = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health:', health.data.status);
  } catch (error) {
    console.log('❌ Health: FAILED');
    return;
  }
  
  // Weather API
  try {
    const weather = await axios.get(`${BASE_URL}/api/weather/forecast/Mumbai`);
    console.log('✅ Weather:', weather.data.success ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.log('❌ Weather: FAILED');
  }
  
  // Mandi API - Enhanced Testing
  try {
    const market = await axios.get(`${BASE_URL}/api/mandi/prices?crop=Rice&limit=3`);
    console.log('✅ Mandi API:', market.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Source:', market.data.data?.source);
    console.log('   Records:', market.data.data?.records?.length || 0);
    
    // Test government API directly
    try {
      const govTest = await axios.get(`${BASE_URL}/api/mandi/test-govt-api`);
      console.log('✅ Gov API:', govTest.data.success ? 'WORKING' : 'FAILED');
    } catch (govError) {
      console.log('⚠️  Gov API: UNAVAILABLE (using fallback)');
    }
  } catch (error) {
    console.log('❌ Mandi API: FAILED');
  }
  
  // Auth Test
  try {
    const auth = await axios.post(`${BASE_URL}/api/auth/register`, {
      phone: '9876543210',
      password: 'test123'
    });
    console.log('✅ Auth:', auth.data.success ? 'SUCCESS' : 'USER EXISTS');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Auth: USER EXISTS (OK)');
    } else {
      console.log('❌ Auth: FAILED');
    }
  }
  
  console.log('\n🎯 Test completed!');
  console.log('\n📋 Available Endpoints:');
  console.log('   /api/mandi/prices - Market prices');
  console.log('   /api/mandi/test-govt-api - Test government data');
  console.log('   /api/weather/forecast/:city - Weather data');
  console.log('   /api/auth/register - User registration');
}

testAllAPIs();