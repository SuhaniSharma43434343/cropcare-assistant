const express = require('express');
const {
  createFarmerRequest,
  getFarmerRequests,
  getMyRequests,
  expressInterest,
  getMyInterests,
  updateInterestStatus
} = require('../controllers/investmentController');
const auth = require('../middleware/auth');
const investorAuth = require('../middleware/investorAuth');

const router = express.Router();

// Farmer routes (require farmer auth)
router.post('/farmer/request', auth, createFarmerRequest);
router.get('/farmer/my-requests', auth, getMyRequests);
router.get('/farmer/interests', auth, getMyInterests);
router.put('/farmer/interest-status', auth, updateInterestStatus);

// Public routes (can be accessed by both farmers and investors)
router.get('/opportunities', getFarmerRequests);

// Investor routes (require investor auth OR farmer auth for testing)
router.post('/investor/interest', (req, res, next) => {
  // Try investor auth first, then farmer auth for testing
  investorAuth(req, res, (err) => {
    if (err) {
      // If investor auth fails, try farmer auth
      auth(req, res, (authErr) => {
        if (authErr) {
          return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        // Set investor to user for testing purposes
        req.investor = { id: req.user.id };
        next();
      });
    } else {
      next();
    }
  });
}, expressInterest);

module.exports = router;