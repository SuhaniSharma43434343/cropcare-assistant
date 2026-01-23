const express = require('express');
const router = express.Router();

// In-memory storage for demo (use database in production)
let farmerRequests = [];
let investorOffers = [];

// Farmer request endpoint
router.post('/farmer-request', async (req, res) => {
  try {
    const { type, ...data } = req.body;
    
    const request = {
      id: Date.now().toString(),
      type,
      ...data,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    farmerRequests.push(request);
    
    res.json({
      success: true,
      message: 'Request submitted successfully',
      requestId: request.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to submit request'
    });
  }
});

// Investor offer endpoint
router.post('/investor-offer', async (req, res) => {
  try {
    const { type, ...data } = req.body;
    
    const offer = {
      id: Date.now().toString(),
      type,
      ...data,
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    
    investorOffers.push(offer);
    
    // Find matching farmer requests
    const matches = farmerRequests.filter(request => {
      if (type === 'Inventory Rent' && request.type === 'Request for Machinery') {
        return request.location?.toLowerCase().includes(data.location?.toLowerCase() || '');
      }
      if (type === 'Loan' && request.type === 'Request for Loan') {
        return request.location?.toLowerCase().includes(data.location?.toLowerCase() || '') &&
               parseInt(request.amount || 0) <= parseInt(data.amount || 0) &&
               parseInt(request.equity || 0) >= parseInt(data.minEquity || 0);
      }
      return false;
    });
    
    res.json({
      success: true,
      message: 'Offer posted successfully',
      offerId: offer.id,
      matches: matches.slice(0, 5) // Return top 5 matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to post offer'
    });
  }
});

// Get farmer requests
router.get('/farmer-requests', async (req, res) => {
  try {
    const { type, location } = req.query;
    
    let filtered = farmerRequests;
    
    if (type) {
      filtered = filtered.filter(req => req.type === type);
    }
    
    if (location) {
      filtered = filtered.filter(req => 
        req.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      requests: filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch requests'
    });
  }
});

// Get investor offers
router.get('/investor-offers', async (req, res) => {
  try {
    const { type, location } = req.query;
    
    let filtered = investorOffers;
    
    if (type) {
      filtered = filtered.filter(offer => offer.type === type);
    }
    
    if (location) {
      filtered = filtered.filter(offer => 
        offer.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      offers: filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch offers'
    });
  }
});

module.exports = router;