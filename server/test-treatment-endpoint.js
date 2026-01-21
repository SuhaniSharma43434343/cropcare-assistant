const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route for treatment endpoint
app.get('/api/diseases/treatment/:diseaseName', (req, res) => {
  const { diseaseName } = req.params;
  console.log(`Testing treatment endpoint for: ${diseaseName}`);
  
  // Mock response for testing
  const mockTreatment = {
    organic: [
      {
        name: "Neem Oil Spray",
        dosage: "5ml per liter of water",
        frequency: "Every 7 days",
        effectiveness: 75,
        instructions: "Apply in early morning or evening."
      }
    ],
    chemical: [
      {
        name: "Copper Fungicide",
        dosage: "2g per liter of water",
        frequency: "Every 10 days",
        effectiveness: 85,
        warning: "Use protective equipment.",
        instructions: "Follow label directions."
      }
    ]
  };
  
  res.json({ success: true, treatments: mockTreatment });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/diseases/treatment/Late%20Blight`);
});