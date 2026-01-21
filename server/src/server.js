const express = require('express'); 
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
require('dotenv').config();

const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

// Import models
const ScanRecord = require('./models/ScanRecord');
const auth = require('./middleware/auth');

const app = express();

// ================= DATABASE =================
connectDB();

// ================= SECURITY =================
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend-domain.com']
    : ['http://localhost:3001'],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// ================= BODY PARSER =================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ================= PYTHON ML CONFIG =================
const PYTHON_ML_URL = process.env.PYTHON_ML_URL || 'http://localhost:8001';

// ================= ML DIAGNOSIS API =================
// Temporarily removed auth for development/testing
app.post('/api/ml/predict', async (req, res) => {
  try {
    const { crop, imageBase64 } = req.body;
    // For development: use test user or create one if needed
    let userId = req.user?.id;

    // If no authenticated user, try to find or create a test user
    if (!userId) {
      const User = require('./models/User');
      let testUser = await User.findOne({ email: 'test@example.com' });
      
      if (!testUser) {
        // Create a test user for development
        testUser = await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'testpassword123',
          selectedCrops: ['tomato', 'potato', 'corn'],
          primaryCrop: 'tomato'
        });
        console.log('✅ Created test user for development');
      }
      
      userId = testUser._id;
    }

    if (!crop || !imageBase64) {
      return res.status(400).json({ 
        success: false,
        message: 'Crop and image are required' 
      });
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Create form data for Python service
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('crop', crop.toLowerCase());
    formData.append('file', imageBuffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    });

    console.log(`Sending request to ML service: ${PYTHON_ML_URL}/predict`);
    console.log(`Crop: ${crop}, Image size: ${imageBuffer.length} bytes`);

    const response = await axios.post(
      `${PYTHON_ML_URL}/predict`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Accept': 'application/json'
        },
        timeout: 30000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    console.log('ML Service Response:', response.data);

    // Validate response from ML service
    if (!response.data || !response.data.name) {
      throw new Error('Invalid response from ML service');
    }

    // Map severity from ML response
    const mapSeverity = (severity) => {
      if (!severity) return 'Moderate';
      const severityLower = severity.toLowerCase();
      if (severityLower.includes('high')) return 'Severe';
      if (severityLower.includes('medium')) return 'Moderate';
      if (severityLower.includes('low')) return 'Mild';
      if (severityLower.includes('healthy')) return 'Healthy';
      return 'Moderate';
    };

    // Save scan record to database
    const scanRecord = new ScanRecord({
      userId,
      crop_name: response.data.analyzed_crop || crop,
      disease_name: response.data.name,
      confidence: Math.round((response.data.confidence || 0.75) * 100),
      severity: mapSeverity(response.data.severity),
      mlResult: response.data
    });

    await scanRecord.save();
    console.log('Scan record saved:', scanRecord._id);

    res.json({
      success: true,
      mlResult: response.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('ML Service Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data
    });

    // Return error - no fallback data since we want ML service to be the sole source
    res.status(503).json({
      success: false,
      message: 'ML service unavailable. Please try again later.',
      error: 'SERVICE_UNAVAILABLE',
      timestamp: new Date().toISOString()
    });
  }
});

// ================= DEPRECATED ENDPOINTS =================
// These endpoints are deprecated and return error messages
app.use('/api/crops', (req, res) => {
  res.status(410).json({ 
    success: false, 
    message: 'This endpoint is deprecated. Crop identification now comes from AI/ML image analysis.' 
  });
});

app.use('/api/diseases', (req, res) => {
  res.status(410).json({ 
    success: false, 
    message: 'This endpoint is deprecated. All disease data now comes from AI/ML analysis.' 
  });
});

app.use('/api/diagnoses', (req, res) => {
  res.status(410).json({ 
    success: false, 
    message: 'This endpoint is deprecated. All diagnosis data now comes from AI/ML analysis.' 
  });
});

// ================= HEALTH =================
app.get('/api/health', async (req, res) => {
  let mlStatus = 'DOWN';

  try {
    await axios.get(`${PYTHON_ML_URL}/health`);
    mlStatus = 'UP';
  } catch (err) {}

  res.json({
    status: 'OK',
    backend: 'RUNNING',
    ml_service: mlStatus,
    timestamp: new Date().toISOString()
  });
});

// ================= ERROR HANDLING =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Node.js Server running on port ${PORT}`);
  console.log(`🔗 Python ML Service: ${PYTHON_ML_URL}`);
});