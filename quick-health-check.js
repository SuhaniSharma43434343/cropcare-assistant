const axios = require('axios');

async function quickHealthCheck() {
  console.log('🏥 Quick Health Check...\n');
  
  const services = [
    { name: 'Backend Health', url: 'http://localhost:5001/api/health' },
    { name: 'Weather API', url: 'http://localhost:5001/api/weather/forecast/Mumbai' },
    { name: 'Mandi API', url: 'http://localhost:5001/api/mandi/prices?crop=Rice&limit=2' }
  ];
  
  for (const service of services) {
    try {
      const response = await axios.get(service.url, { timeout: 5000 });
      console.log(`✅ ${service.name}: WORKING`);
    } catch (error) {
      console.log(`❌ ${service.name}: FAILED - ${error.message}`);
    }
  }
  
  console.log('\n🎯 Health check completed!');
}

quickHealthCheck();