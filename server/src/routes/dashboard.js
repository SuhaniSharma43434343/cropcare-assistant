const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getDashboardSummary,
  getHealthTrend,
  getDiseaseBreakdown,
  getRecentDiagnoses
} = require('../controllers/dashboardController');

// All dashboard routes require authentication
// Temporarily disabled for development/testing
// router.use(auth);

// Dashboard summary - overall health, weekly change, active issues
router.get('/summary', getDashboardSummary);

// Health trend - 7-day health score trend for line graph
router.get('/health-trend', getHealthTrend);

// Disease breakdown - monthly disease counts for bar graph
router.get('/disease-breakdown', getDiseaseBreakdown);

// Recent diagnoses - last 10 scan results
router.get('/recent-diagnoses', getRecentDiagnoses);

module.exports = router;