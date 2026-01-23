#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

// Import models
const User = require('./server/src/models/User');
const FarmerRequest = require('./server/src/models/FarmerRequest');

const sampleFarmerRequests = [
  {
    farmerName: 'Rajesh Kumar',
    cropType: 'Tomato',
    location: 'Punjab, India',
    landSize: 5,
    investmentNeeded: 200000,
    equityOffered: 15,
    taxRate: 12.5,
    contactMobile: '+91-9876543210',
    description: 'Experienced tomato farmer looking for investment to expand greenhouse operations. 10+ years experience with organic farming methods.'
  },
  {
    farmerName: 'Priya Sharma',
    cropType: 'Wheat',
    location: 'Haryana, India',
    landSize: 10,
    investmentNeeded: 350000,
    equityOffered: 20,
    taxRate: 18.0,
    contactMobile: '+91-9876543211',
    description: 'Looking to invest in modern irrigation systems and high-yield wheat varieties. Family farming business for 3 generations.'
  },
  {
    farmerName: 'Suresh Patel',
    cropType: 'Cotton',
    location: 'Gujarat, India',
    landSize: 8,
    investmentNeeded: 450000,
    equityOffered: 25,
    taxRate: 15.0,
    contactMobile: '+91-9876543212',
    description: 'Cotton farming with focus on sustainable practices. Need investment for drip irrigation and organic pest control systems.'
  },
  {
    farmerName: 'Meera Devi',
    cropType: 'Rice',
    location: 'West Bengal, India',
    landSize: 6,
    investmentNeeded: 180000,
    equityOffered: 18,
    taxRate: 10.0,
    contactMobile: '+91-9876543213',
    description: 'Traditional rice farming with plans to introduce SRI (System of Rice Intensification) methods. Looking for technology upgrade funding.'
  },
  {
    farmerName: 'Arjun Singh',
    cropType: 'Sugarcane',
    location: 'Uttar Pradesh, India',
    landSize: 12,
    investmentNeeded: 600000,
    equityOffered: 30,
    taxRate: 22.0,
    contactMobile: '+91-9876543214',
    description: 'Large-scale sugarcane farming operation. Investment needed for mechanization and processing equipment.'
  },
  {
    farmerName: 'Lakshmi Reddy',
    cropType: 'Chili',
    location: 'Andhra Pradesh, India',
    landSize: 4,
    investmentNeeded: 150000,
    equityOffered: 12,
    taxRate: 8.5,
    contactMobile: '+91-9876543215',
    description: 'Specialty chili varieties for export market. Need funding for quality certification and cold storage facilities.'
  }
];

async function createSampleData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create a test user to be the farmer
    let testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      console.log('📝 Creating test user...');
      testUser = await User.create({
        name: 'Test Farmer',
        email: 'test@example.com',
        password: 'testpassword123',
        phone: '+91-9999999999',
        selectedCrops: ['tomato', 'wheat', 'rice'],
        primaryCrop: 'tomato'
      });
      console.log('✅ Test user created');
    }

    // Clear existing farmer requests
    await FarmerRequest.deleteMany({});
    console.log('🗑️  Cleared existing farmer requests');

    // Create sample farmer requests
    console.log('📝 Creating sample farmer requests...');
    
    const requests = sampleFarmerRequests.map(request => ({
      ...request,
      farmerId: testUser._id,
      status: 'active',
      interestCount: Math.floor(Math.random() * 5) // Random interest count 0-4
    }));

    await FarmerRequest.insertMany(requests);
    
    console.log('✅ Sample investment data created successfully!');
    console.log(`📊 Created ${requests.length} farmer requests`);
    console.log('');
    console.log('🎯 Sample Data Summary:');
    requests.forEach((req, index) => {
      console.log(`${index + 1}. ${req.farmerName} - ${req.cropType} (₹${req.investmentNeeded.toLocaleString()}, ${req.equityOffered}% equity)`);
    });
    
    console.log('');
    console.log('🚀 You can now:');
    console.log('1. Start the application: npm start (in both server and User directories)');
    console.log('2. Navigate to Investment page');
    console.log('3. Click on "Farmer" to create requests or view notifications');
    console.log('4. Click on "Investor" to browse opportunities');
    console.log('5. Test the complete investment flow');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createSampleData();