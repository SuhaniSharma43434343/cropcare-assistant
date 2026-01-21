const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const ScanRecord = require('./src/models/ScanRecord');
const User = require('./src/models/User');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Create sample scan records for disease breakdown testing
const createSampleData = async () => {
  try {
    // Find or create a test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('No test user found. Please create a user first.');
      return;
    }

    console.log('Creating sample scan records for disease breakdown...');

    // Clear existing scan records for test user
    await ScanRecord.deleteMany({ userId: testUser._id });

    // Create sample data for current month (disease breakdown)
    const sampleScans = [];
    const now = new Date();

    // Current month diseases - various diseases with different counts
    const diseases = [
      { name: 'Late Blight', count: 12 },
      { name: 'Early Blight', count: 8 },
      { name: 'Bacterial Spot', count: 5 },
      { name: 'Corn Leaf Blight', count: 3 },
      { name: 'Wheat Rust', count: 2 }
    ];

    diseases.forEach(disease => {
      for (let i = 0; i < disease.count; i++) {
        sampleScans.push({
          userId: testUser._id,
          crop_name: 'Tomato',
          disease_name: disease.name,
          confidence: 85 + Math.random() * 10, // 85-95% confidence
          severity: 'Moderate',
          timestamp: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random time in last 30 days
        });
      }
    });

    // Add some healthy scans (should be excluded from breakdown)
    for (let i = 0; i < 5; i++) {
      sampleScans.push({
        userId: testUser._id,
        crop_name: 'Wheat',
        disease_name: 'Healthy',
        confidence: 95,
        severity: 'Healthy',
        timestamp: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }

    // Insert sample data
    await ScanRecord.insertMany(sampleScans);
    console.log(`✅ Created ${sampleScans.length} sample scan records for disease breakdown testing`);

    // Show expected disease breakdown
    console.log('\n📊 Expected Disease Breakdown (current month):');
    diseases.forEach(disease => {
      console.log(`${disease.name}: ${disease.count}`);
    });
    console.log('Healthy scans: 5 (excluded from breakdown)');

    console.log('\n✅ Sample data created successfully!');
    console.log('You can now test the disease breakdown endpoint:');
    console.log('- GET /api/dashboard/disease-breakdown');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
};

// Run the script
const main = async () => {
  await connectDB();
  await createSampleData();
  mongoose.connection.close();
};

main();