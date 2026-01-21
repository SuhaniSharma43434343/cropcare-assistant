const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const cleanupDatabase = async () => {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Drop collections that contain hardcoded data
    const collections = ['crops', 'diagnoses', 'diseases'];
    
    for (const collectionName of collections) {
      try {
        await mongoose.connection.db.dropCollection(collectionName);
        console.log(`✅ Dropped collection: ${collectionName}`);
      } catch (error) {
        if (error.message.includes('ns not found')) {
          console.log(`ℹ️  Collection ${collectionName} does not exist`);
        } else {
          console.error(`❌ Error dropping ${collectionName}:`, error.message);
        }
      }
    }
    
    // Remove any cached/hardcoded data documents
    const db = mongoose.connection.db;
    const allCollections = await db.listCollections().toArray();
    
    for (const collection of allCollections) {
      const collectionName = collection.name;
      
      // Skip system collections and user collection
      if (collectionName.startsWith('system.') || collectionName === 'users') {
        continue;
      }
      
      // Check if collection contains hardcoded data patterns
      const coll = db.collection(collectionName);
      const sampleDoc = await coll.findOne({});
      
      if (sampleDoc) {
        // Look for hardcoded patterns
        const docString = JSON.stringify(sampleDoc).toLowerCase();
        const hardcodedPatterns = [
          'late blight',
          'early blight', 
          'bacterial spot',
          'powdery mildew',
          'mosaic virus',
          'neem oil',
          'copper fungicide',
          'mancozeb'
        ];
        
        const hasHardcodedData = hardcodedPatterns.some(pattern => 
          docString.includes(pattern)
        );
        
        if (hasHardcodedData) {
          await coll.deleteMany({});
          console.log(`🗑️  Cleaned hardcoded data from collection: ${collectionName}`);
        }
      }
    }
    
    console.log('✅ Database cleanup completed');
    console.log('ℹ️  All disease detection, treatment recommendations, and crop identification');
    console.log('   will now come exclusively from the AI/ML service');
    
  } catch (error) {
    console.error('❌ Database cleanup error:', error);
  }
};

const main = async () => {
  await connectDB();
  await cleanupDatabase();
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Script error:', error);
  process.exit(1);
});