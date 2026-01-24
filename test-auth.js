const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow...\n');
  
  const testUser = {
    phone: '9876543210',
    password: 'testpass123'
  };
  
  try {
    // Test Registration
    console.log('📝 Testing Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    
    if (registerResponse.data.success) {
      console.log('✅ Registration: SUCCESS');
      console.log('Token received:', !!registerResponse.data.token);
      console.log('User data:', registerResponse.data.user.phone);
    } else {
      console.log('❌ Registration: FAILED -', registerResponse.data.message);
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️  Registration: User already exists (expected for repeat tests)');
    } else {
      console.log('❌ Registration: ERROR -', error.response?.data?.message || error.message);
    }
  }
  
  try {
    // Test Login
    console.log('\n🔑 Testing Login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, testUser);
    
    if (loginResponse.data.success) {
      console.log('✅ Login: SUCCESS');
      console.log('Token received:', !!loginResponse.data.token);
      console.log('User data:', loginResponse.data.user.phone);
      
      // Test Profile Access
      console.log('\n👤 Testing Profile Access...');
      const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.token}`
        }
      });
      
      if (profileResponse.data.success) {
        console.log('✅ Profile Access: SUCCESS');
        console.log('Profile data:', profileResponse.data.user.phone);
      } else {
        console.log('❌ Profile Access: FAILED');
      }
    } else {
      console.log('❌ Login: FAILED -', loginResponse.data.message);
    }
  } catch (error) {
    console.log('❌ Login: ERROR -', error.response?.data?.message || error.message);
  }
  
  console.log('\n🎯 Authentication test completed!');
}

testAuthFlow();