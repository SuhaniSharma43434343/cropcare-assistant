const express = require('express');
const axios = require('axios');
const router = express.Router();

// Mock data as fallback
const mockMandiData = {
  records: [
    {
      commodity: "Rice",
      modal_price: "2150",
      market: "Pune APMC",
      district: "Pune",
      state: "Maharashtra"
    },
    {
      commodity: "Wheat", 
      modal_price: "2350",
      market: "Delhi Mandi",
      district: "Delhi",
      state: "Delhi"
    },
    {
      commodity: "Tomato",
      modal_price: "1500", 
      market: "Mumbai APMC",
      district: "Mumbai",
      state: "Maharashtra"
    },
    {
      commodity: "Potato",
      modal_price: "1200",
      market: "Nashik APMC", 
      district: "Nashik",
      state: "Maharashtra"
    },
    {
      commodity: "Onion",
      modal_price: "2800",
      market: "Pune APMC",
      district: "Pune", 
      state: "Maharashtra"
    }
  ]
};

// Get mandi prices
router.get('/prices', async (req, res) => {
  try {
    const { crop, limit = 10 } = req.query;
    
    // Try government API first
    try {
      const response = await axios.get(
        'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
        {
          params: {
            'api-key': '579b464db66ec23bdd0000011dff195781234c2349ed51abe8c46981',
            format: 'json',
            limit: limit
          },
          timeout: 5000
        }
      );
      
      if (response.data && response.data.records) {
        let records = response.data.records;
        
        // Filter by crop if specified
        if (crop) {
          records = records.filter(record => 
            record.commodity && 
            record.commodity.toLowerCase().includes(crop.toLowerCase())
          );
        }
        
        return res.json({
          success: true,
          data: {
            records: records,
            source: 'government_api',
            lastUpdated: new Date().toISOString()
          }
        });
      }
    } catch (apiError) {
      console.log('Government API failed, using mock data:', apiError.message);
    }
    
    // Fallback to mock data
    let records = mockMandiData.records;
    
    // Filter mock data by crop if specified
    if (crop) {
      records = records.filter(record => 
        record.commodity.toLowerCase().includes(crop.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: {
        records: records.slice(0, parseInt(limit)),
        source: 'mock_data',
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Mandi API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market prices'
    });
  }
});

module.exports = router;