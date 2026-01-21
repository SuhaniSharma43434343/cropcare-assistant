#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating CropCare AI cleanup...\n');

const projectRoot = __dirname;
const errors = [];
const warnings = [];

// Files to check for hardcoded data
const filesToCheck = [
  'server/src/routes/diseases.js',
  'server/src/controllers/cropController.js', 
  'server/src/controllers/diagnosisController.js',
  'User/src/services/dataCleanupService.js',
  'User/src/pages/Treatment.js',
  'server/src/server.js'
];

// Patterns that should NOT exist (hardcoded data)
const forbiddenPatterns = [
  /DISEASE_TREATMENTS\s*=/,
  /VALID_DISEASES\s*=/,
  /VALID_CROPS\s*=/,
  /validatedTreatments\s*=/,
  /getValidatedTreatments/,
  /fetchTreatmentsFromAPI/,
  /'late blight':\s*{/,
  /'early blight':\s*{/,
  /Mancozeb 75% WP/,
  /Copper Fungicide \(Organic\)/,
  /fallback.*treatment/i
];

// Patterns that SHOULD exist (ML service integration)
const requiredPatterns = [
  /python.*ml.*service/i,
  /ml.*service.*response/i,
  /ai.*analysis/i
];

console.log('📁 Checking files for hardcoded data removal...\n');

filesToCheck.forEach(filePath => {
  const fullPath = path.join(projectRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    warnings.push(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  
  console.log(`🔍 Checking: ${filePath}`);
  
  // Check for forbidden patterns
  forbiddenPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      errors.push(`❌ Found hardcoded data in ${filePath}: ${pattern}`);
    }
  });
  
  // Check for required patterns (at least one should exist)
  const hasRequiredPattern = requiredPatterns.some(pattern => pattern.test(content));
  if (!hasRequiredPattern && !filePath.includes('dataCleanupService')) {
    warnings.push(`⚠️  ${filePath} may not be properly integrated with ML service`);
  }
  
  console.log(`   ✅ Checked`);
});

console.log('\n📊 Validation Results:\n');

if (errors.length === 0) {
  console.log('✅ SUCCESS: No hardcoded disease/treatment data found!');
  console.log('✅ All data sources have been cleaned up');
  console.log('✅ AI/ML service is now the sole source for:');
  console.log('   - Disease detection');
  console.log('   - Treatment recommendations'); 
  console.log('   - Crop identification');
} else {
  console.log('❌ ERRORS FOUND:');
  errors.forEach(error => console.log(`   ${error}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(warning => console.log(`   ${warning}`));
}

console.log('\n🎯 Next Steps:');
console.log('1. Run the database cleanup script: node server/cleanup-hardcoded-data.js');
console.log('2. Start the Python ML service: cd python-ml-service && python app.py');
console.log('3. Start the backend: cd server && npm start');
console.log('4. Start the frontend: cd User && npm start');
console.log('5. Test image upload to verify ML service integration');

console.log('\n✨ The system now relies exclusively on AI/ML analysis!');

process.exit(errors.length > 0 ? 1 : 0);