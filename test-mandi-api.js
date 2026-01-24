const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

async function testMandiAPI() {
  console.log('🧪 Testing Mandi (Market Price) API Implementation\n');
  
  try {
    // Test 1: Direct government API test
    console.log('1️⃣ Testing direct government API access...');
    const govResponse = await axios.get(`${BASE_URL}/api/mandi/test-govt-api`);
    console.log('✅ Government API Status:', govResponse.data.success ? 'SUCCESS' : 'FAILED');
    if (govResponse.data.success) {
      console.log('   Records found:', govResponse.data.data?.records?.length || 0);
    }
    
    // Test 2: Backend mandi API
    console.log('\n2️⃣ Testing backend mandi API...');
    const mandiResponse = await axios.get(`${BASE_URL}/api/mandi/prices?limit=5`);
    console.log('✅ Mandi API Status:', mandiResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Data source:', mandiResponse.data.data?.source);
    console.log('   Records found:', mandiResponse.data.data?.records?.length || 0);
    
    if (mandiResponse.data.data?.records?.length > 0) {
      console.log('\n📊 Sample Market Data:');
      mandiResponse.data.data.records.slice(0, 3).forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.commodity} - ₹${record.modal_price || record.min_price || 'N/A'}/qtl (${record.market || record.district})`);
      });
    }
    
    // Test 3: Crop-specific search
    console.log('\n3️⃣ Testing crop-specific search...');
    const riceResponse = await axios.get(`${BASE_URL}/api/mandi/prices?crop=Rice&limit=3`);
    console.log('✅ Rice prices:', riceResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Records found:', riceResponse.data.data?.records?.length || 0);
    
    console.log('\n🎯 Mandi API Test Complete!');
    console.log('\n📋 API Endpoints Available:');
    console.log('   GET /api/mandi/prices - Get all market prices');
    console.log('   GET /api/mandi/prices?crop=Rice - Get prices for specific crop');
    console.log('   GET /api/mandi/test-govt-api - Test government API directly');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd server && npm start');
    }
  }
}

testMandiAPI();