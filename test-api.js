const axios = require('axios');

const API_BASE = 'http://localhost:5001';

async function testAPI() {
  console.log('🧪 Testing CropCare API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/api/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test ML prediction endpoint
    console.log('\n2. Testing ML prediction endpoint...');
    const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='; // 1x1 pixel PNG
    
    const predictionResponse = await axios.post(`${API_BASE}/api/ml/predict`, {
      crop: 'tomato',
      imageBase64: testImage
    });
    
    console.log('✅ ML Prediction:', predictionResponse.data);

    console.log('\n🎉 All API tests passed! The backend is working correctly.');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testAPI();