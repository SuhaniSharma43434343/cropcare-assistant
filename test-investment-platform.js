#!/usr/bin/env node

const axios = require('axios');

const API_URL = 'http://localhost:5001';

async function testInvestmentPlatform() {
  console.log('🧪 Testing Investment Platform APIs...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.data.status);
    console.log('   Backend:', healthResponse.data.backend);
    console.log('   ML Service:', healthResponse.data.ml_service);
    console.log('');

    // Test 2: Get Investment Opportunities (Public)
    console.log('2️⃣  Testing investment opportunities endpoint...');
    const opportunitiesResponse = await axios.get(`${API_URL}/api/investment/opportunities`);
    console.log('✅ Opportunities fetched:', opportunitiesResponse.data.success);
    console.log('   Count:', opportunitiesResponse.data.data?.length || 0);
    console.log('');

    // Test 3: Test User Login
    console.log('3️⃣  Testing user authentication...');
    try {
      const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
        email: 'test@example.com',
        password: 'testpassword123'
      });
      
      if (loginResponse.data.success) {
        console.log('✅ User login successful');
        const token = loginResponse.data.token;
        
        // Test 4: Create Farmer Request
        console.log('4️⃣  Testing farmer request creation...');
        const farmerRequestResponse = await axios.post(
          `${API_URL}/api/investment/farmer/request`,
          {
            farmerName: 'Test Farmer API',
            cropType: 'Test Crop',
            location: 'Test Location',
            landSize: 5,
            investmentNeeded: 100000,
            equityOffered: 15,
            contactMobile: '+91-9999999999',
            description: 'Test farmer request via API'
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log('✅ Farmer request created:', farmerRequestResponse.data.success);
        
        // Test 5: Get My Requests
        console.log('5️⃣  Testing get my requests...');
        const myRequestsResponse = await axios.get(
          `${API_URL}/api/investment/farmer/my-requests`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log('✅ My requests fetched:', myRequestsResponse.data.success);
        console.log('   Count:', myRequestsResponse.data.data?.length || 0);
        
      } else {
        console.log('❌ User login failed:', loginResponse.data.message);
      }
    } catch (authError) {
      console.log('⚠️  User not found, this is expected for first run');
      console.log('   Run create-sample-investment-data.js first');
    }

    console.log('');
    console.log('🎉 Investment Platform API Test Complete!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Run: node create-sample-investment-data.js');
    console.log('2. Start services: start-investment-platform.bat');
    console.log('3. Open browser: http://localhost:3001');
    console.log('4. Navigate to Investment page');
    console.log('5. Test the complete flow');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('💡 Make sure the backend server is running:');
      console.log('   cd server && npm start');
    }
  }
}

testInvestmentPlatform();