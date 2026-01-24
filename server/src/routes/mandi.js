const express = require('express');
const axios = require('axios');
const router = express.Router();

// Government API configuration
const GOVT_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const API_KEY = '579b464db66ec23bdd0000011dff195781234c2349ed51abe8c46981';

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
    
    console.log(`Fetching mandi prices for crop: ${crop || 'all'}, limit: ${limit}`);
    
    // Try government API first
    try {
      const response = await axios.get(GOVT_API_URL, {
        params: {
          'api-key': API_KEY,
          format: 'json',
          limit: parseInt(limit),
          offset: 0
        },
        timeout: 15000,
        headers: {
          'User-Agent': 'CropCare-Assistant/1.0',
          'Accept': 'application/json'
        }
      });
      
      console.log('Government API response status:', response.status);
      console.log('Government API response data keys:', Object.keys(response.data));
      
      if (response.data && response.data.records && response.data.records.length > 0) {
        let records = response.data.records;
        
        console.log(`Found ${records.length} records from government API`);
        
        // Filter by crop if specified
        if (crop) {
          const originalCount = records.length;
          records = records.filter(record => 
            record.commodity && 
            record.commodity.toLowerCase().includes(crop.toLowerCase())
          );
          console.log(`Filtered from ${originalCount} to ${records.length} records for crop: ${crop}`);
        }
        
        // If no matching records found after filtering, use all records
        if (records.length === 0 && crop) {
          console.log('No matching records found, returning all records');
          records = response.data.records;
        }
        
        return res.json({
          success: true,
          data: {
            records: records.slice(0, parseInt(limit)),
            source: 'government_api',
            lastUpdated: new Date().toISOString(),
            totalRecords: records.length
          }
        });
      } else {
        console.log('Government API returned no records');
      }
    } catch (apiError) {
      console.error('Government API failed:', {
        message: apiError.message,
        code: apiError.code,
        status: apiError.response?.status,
        statusText: apiError.response?.statusText
      });
    }
    
    // Fallback to mock data
    console.log('Using mock data as fallback');
    let records = mockMandiData.records;
    
    // Filter mock data by crop if specified
    if (crop) {
      records = records.filter(record => 
        record.commodity.toLowerCase().includes(crop.toLowerCase())
      );
      
      // If no matching records, add some generic ones for the crop
      if (records.length === 0) {
        records = [
          {
            commodity: crop,
            modal_price: (Math.floor(Math.random() * 1000) + 1500).toString(),
            market: "Local APMC",
            district: "Mumbai",
            state: "Maharashtra"
          },
          {
            commodity: crop,
            modal_price: (Math.floor(Math.random() * 1000) + 1500).toString(),
            market: "Regional Market",
            district: "Pune",
            state: "Maharashtra"
          }
        ];
      }
    }
    
    res.json({
      success: true,
      data: {
        records: records.slice(0, parseInt(limit)),
        source: 'mock_data',
        lastUpdated: new Date().toISOString(),
        totalRecords: records.length
      }
    });
    
  } catch (error) {
    console.error('Mandi API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market prices',
      message: error.message
    });
  }
});

// Test endpoint to check government API directly
router.get('/test-govt-api', async (req, res) => {
  try {
    console.log('Testing government API directly...');
    
    const response = await axios.get(GOVT_API_URL, {
      params: {
        'api-key': API_KEY,
        format: 'json',
        limit: 5
      },
      timeout: 15000,
      headers: {
        'User-Agent': 'CropCare-Assistant/1.0',
        'Accept': 'application/json'
      }
    });
    
    res.json({
      success: true,
      status: response.status,
      headers: response.headers,
      data: response.data,
      message: 'Government API is working'
    });
    
  } catch (error) {
    console.error('Government API test failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      status: error.response?.status,
      message: 'Government API test failed'
    });
  }
});

module.exports = router;