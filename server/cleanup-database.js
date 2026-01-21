const mongoose = require('mongoose');
require('dotenv').config();

// Valid data constants
const VALID_DISEASES = [
  'Late Blight', 'Early Blight', 'Common Rust', 'Powdery Mildew',
  'Leaf Spot', 'Root Rot', 'Bacterial Wilt', 'Mosaic Virus',
  'Anthracnose', 'Downy Mildew'
];

const VALID_CROPS = [
  'tomato', 'potato', 'corn', 'wheat', 'rice', 'pepper',
  'cucumber', 'lettuce', 'spinach', 'carrot'
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cropcare');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Disease schema (for reference)
const diseaseSchema = new mongoose.Schema({
  name: String,
  crop: String,
  symptoms: [String],
  treatment: {
    organic: [String],
    chemical: [String]
  },
  prevention: [String],
  severity: String
});

const Disease = mongoose.model('Disease', diseaseSchema);

// Diagnosis schema (for reference)
const diagnosisSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  cropType: String,
  diseaseName: String,
  confidence: Number,
  severity: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);

// Cleanup functions
async function cleanupDiseases() {
  console.log('🧹 Cleaning up diseases collection...');
  
  try {
    // Find invalid disease names
    const invalidDiseases = await Disease.find({
      name: { $not: { $in: VALID_DISEASES } }
    });
    
    console.log(`Found ${invalidDiseases.length} invalid disease entries`);
    
    // Log invalid entries before deletion
    invalidDiseases.forEach(disease => {
      console.log(`❌ Invalid disease: ${disease.name} (ID: ${disease._id})`);
    });
    
    // Delete invalid diseases
    const deleteResult = await Disease.deleteMany({
      name: { $not: { $in: VALID_DISEASES } }
    });
    
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} invalid disease entries`);
    
    // Update crop names to lowercase
    await Disease.updateMany(
      { crop: { $exists: true } },
      [{ $set: { crop: { $toLower: '$crop' } } }]
    );
    
    console.log('✅ Disease collection cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning diseases:', error.message);
  }
}

async function cleanupDiagnoses() {
  console.log('🧹 Cleaning up diagnoses collection...');
  
  try {
    // Find invalid diagnoses
    const invalidDiagnoses = await Diagnosis.find({
      $or: [
        { diseaseName: { $not: { $in: VALID_DISEASES } } },
        { cropType: { $not: { $in: VALID_CROPS } } }
      ]
    });
    
    console.log(`Found ${invalidDiagnoses.length} invalid diagnosis entries`);
    
    // Log invalid entries
    invalidDiagnoses.forEach(diagnosis => {
      console.log(`❌ Invalid diagnosis: ${diagnosis.diseaseName} for ${diagnosis.cropType} (ID: ${diagnosis._id})`);
    });
    
    // Delete invalid diagnoses
    const deleteResult = await Diagnosis.deleteMany({
      $or: [
        { diseaseName: { $not: { $in: VALID_DISEASES } } },
        { cropType: { $not: { $in: VALID_CROPS } } }
      ]
    });
    
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} invalid diagnosis entries`);
    
    // Update crop types to lowercase
    await Diagnosis.updateMany(
      { cropType: { $exists: true } },
      [{ $set: { cropType: { $toLower: '$cropType' } } }]
    );
    
    console.log('✅ Diagnosis collection cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning diagnoses:', error.message);
  }
}

async function validateAndFixData() {
  console.log('🔧 Validating and fixing existing data...');
  
  try {
    // Fix common misspellings in disease names
    const misspellingFixes = {
      'tomato let blight': 'Late Blight',
      'let blight': 'Late Blight',
      'late bright': 'Late Blight',
      'early bright': 'Early Blight',
      'powder mildew': 'Powdery Mildew',
      'leafspot': 'Leaf Spot',
      'rootrot': 'Root Rot'
    };
    
    for (const [incorrect, correct] of Object.entries(misspellingFixes)) {
      // Fix diseases
      const diseaseUpdateResult = await Disease.updateMany(
        { name: { $regex: new RegExp(incorrect, 'i') } },
        { $set: { name: correct } }
      );
      
      if (diseaseUpdateResult.modifiedCount > 0) {
        console.log(`🔧 Fixed ${diseaseUpdateResult.modifiedCount} disease entries: "${incorrect}" → "${correct}"`);
      }
      
      // Fix diagnoses
      const diagnosisUpdateResult = await Diagnosis.updateMany(
        { diseaseName: { $regex: new RegExp(incorrect, 'i') } },
        { $set: { diseaseName: correct } }
      );
      
      if (diagnosisUpdateResult.modifiedCount > 0) {
        console.log(`🔧 Fixed ${diagnosisUpdateResult.modifiedCount} diagnosis entries: "${incorrect}" → "${correct}"`);
      }
    }
    
    console.log('✅ Data validation and fixing completed');
  } catch (error) {
    console.error('❌ Error validating data:', error.message);
  }
}

async function generateCleanupReport() {
  console.log('📊 Generating cleanup report...');
  
  try {
    const diseaseCount = await Disease.countDocuments();
    const diagnosisCount = await Diagnosis.countDocuments();
    
    const validDiseases = await Disease.find({ name: { $in: VALID_DISEASES } }).countDocuments();
    const validDiagnoses = await Diagnosis.find({ 
      diseaseName: { $in: VALID_DISEASES },
      cropType: { $in: VALID_CROPS }
    }).countDocuments();
    
    console.log('\n📊 CLEANUP REPORT');
    console.log('==================');
    console.log(`Total diseases in database: ${diseaseCount}`);
    console.log(`Valid diseases: ${validDiseases}`);
    console.log(`Total diagnoses in database: ${diagnosisCount}`);
    console.log(`Valid diagnoses: ${validDiagnoses}`);
    console.log('\n✅ All data is now validated and clean!');
    
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
  }
}

// Main cleanup function
async function runCleanup() {
  console.log('🚀 Starting database cleanup...');
  console.log('================================');
  
  await connectDB();
  
  try {
    await validateAndFixData();
    await cleanupDiseases();
    await cleanupDiagnoses();
    await generateCleanupReport();
    
    console.log('\n🎉 Database cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run cleanup if this file is executed directly
if (require.main === module) {
  runCleanup();
}

module.exports = {
  runCleanup,
  cleanupDiseases,
  cleanupDiagnoses,
  validateAndFixData
};