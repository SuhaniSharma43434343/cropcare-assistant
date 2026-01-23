const express = require('express');
const {
  registerInvestor,
  loginInvestor,
  getInvestorProfile,
  updateInvestorProfile
} = require('../controllers/investorAuthController');
const investorAuth = require('../middleware/investorAuth');

const router = express.Router();

router.post('/register', registerInvestor);
router.post('/login', loginInvestor);
router.get('/profile', investorAuth, getInvestorProfile);
router.put('/profile', investorAuth, updateInvestorProfile);

module.exports = router;