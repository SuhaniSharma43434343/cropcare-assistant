#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

async function testWeatherAPI() {
  console.log('🌤️  Testing Weather API...\n');
  
  try {
    // Test weather by coordinates (Mumbai)
    console.log('1. Testing weather by coordinates (Mumbai: 19.0760, 72.8777)');
    const coordsResponse = await axios.get(`${BASE_URL}/api/weather/forecast/coords/19.0760/72.8777`);
    console.log('✅ Weather by coordinates:', {
      success: coordsResponse.data.success,
      temperature: coordsResponse.data.data?.current?.temperature,
      city: coordsResponse.data.data?.current?.city,
      description: coordsResponse.data.data?.current?.description
    });
    
    // Test weather by city
    console.log('\n2. Testing weather by city (Mumbai)');
    const cityResponse = await axios.get(`${BASE_URL}/api/weather/forecast/Mumbai`);
    console.log('✅ Weather by city:', {
      success: cityResponse.data.success,
      temperature: cityResponse.data.data?.current?.temperature,
      city: cityResponse.data.data?.current?.city,
      description: cityResponse.data.data?.current?.description
    });
    
  } catch (error) {
    console.error('❌ Weather API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

async function testMandiAPI() {
  console.log('\n💰 Testing Mandi API...\n');
  
  try {
    // Test general mandi prices
    console.log('1. Testing general mandi prices');
    const generalResponse = await axios.get(`${BASE_URL}/api/mandi/prices?limit=5`);
    console.log('✅ General mandi prices:', {
      success: generalResponse.data.success,
      recordCount: generalResponse.data.data?.records?.length,
      source: generalResponse.data.data?.source,
      firstRecord: generalResponse.data.data?.records?.[0]
    });
    
    // Test crop-specific prices
    console.log('\n2. Testing crop-specific prices (Rice)');
    const riceResponse = await axios.get(`${BASE_URL}/api/mandi/prices?crop=Rice&limit=3`);
    console.log('✅ Rice prices:', {
      success: riceResponse.data.success,
      recordCount: riceResponse.data.data?.records?.length,
      source: riceResponse.data.data?.source,
      firstRecord: riceResponse.data.data?.records?.[0]
    });
    
    // Test government API directly
    console.log('\n3. Testing government API directly');
    const govtResponse = await axios.get(`${BASE_URL}/api/mandi/test-govt-api`);
    console.log('✅ Government API test:', {
      success: govtResponse.data.success,
      status: govtResponse.data.status,
      recordCount: govtResponse.data.data?.records?.length || 0,
      message: govtResponse.data.message
    });
    
  } catch (error) {
    console.error('❌ Mandi API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...\n');
  
  try {
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', {
      status: healthResponse.data.status,
      backend: healthResponse.data.backend,
      ml_service: healthResponse.data.ml_service
    });
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  console.log('Make sure the backend server is running on port 5001\n');
  
  await testHealthCheck();
  await testWeatherAPI();
  await testMandiAPI();
  
  console.log('\n✨ API Tests Complete!\n');
  console.log('📋 Summary:');
  console.log('- Weather API: Tests current weather by coordinates and city');
  console.log('- Mandi API: Tests market prices with government API fallback');
  console.log('- Health Check: Verifies backend and ML service status');
  console.log('\n🎯 Next Steps:');
  console.log('1. Start the frontend: cd User && npm start');
  console.log('2. Check the dashboard for weather and market data');
  console.log('3. Verify real-time updates are working');
}

runTests().catch(console.error);