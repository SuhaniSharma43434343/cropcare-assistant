const express = require('express');
const router = express.Router();

// All disease and treatment data now comes from Python ML service
// These endpoints are deprecated and return error messages

// Get all diseases - deprecated
router.get('/', async (req, res) => {
  res.status(410).json({ 
    success: false, 
    message: 'This endpoint is deprecated. All disease data now comes from AI/ML analysis.' 
  });
});

// Get disease by ID - deprecated
router.get('/:id', async (req, res) => {
  res.status(410).json({ 
    success: false, 
    message: 'This endpoint is deprecated. All disease data now comes from AI/ML analysis.' 
  });
});

// Get treatment for specific disease - deprecated
router.get('/treatment/:diseaseName', async (req, res) => {
  res.status(410).json({ 
    success: false, 
    message: 'This endpoint is deprecated. All treatment data now comes from AI/ML analysis.' 
  });
});

module.exports = router;