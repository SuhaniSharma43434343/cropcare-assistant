const express = require('express');
const router = express.Router();

// Mock crop rates data - In production, this would connect to real market APIs
const CROP_RATES = {
  'mumbai': {
    'tomato': { price: 45, unit: 'kg', change: '+5%', trend: 'up' },
    'potato': { price: 28, unit: 'kg', change: '-2%', trend: 'down' },
    'wheat': { price: 2150, unit: 'quintal', change: '+3%', trend: 'up' },
    'rice': { price: 3200, unit: 'quintal', change: '+1%', trend: 'up' },
    'corn': { price: 1850, unit: 'quintal', change: '-1%', trend: 'down' },
    'onion': { price: 35, unit: 'kg', change: '+8%', trend: 'up' }
  },
  'delhi': {
    'tomato': { price: 42, unit: 'kg', change: '+3%', trend: 'up' },
    'potato': { price: 25, unit: 'kg', change: '-1%', trend: 'down' },
    'wheat': { price: 2100, unit: 'quintal', change: '+2%', trend: 'up' },
    'rice': { price: 3150, unit: 'quintal', change: '0%', trend: 'stable' },
    'corn': { price: 1800, unit: 'quintal', change: '-2%', trend: 'down' },
    'onion': { price: 32, unit: 'kg', change: '+6%', trend: 'up' }
  },
  'bangalore': {
    'tomato': { price: 48, unit: 'kg', change: '+7%', trend: 'up' },
    'potato': { price: 30, unit: 'kg', change: '+1%', trend: 'up' },
    'wheat': { price: 2200, unit: 'quintal', change: '+4%', trend: 'up' },
    'rice': { price: 3300, unit: 'quintal', change: '+2%', trend: 'up' },
    'corn': { price: 1900, unit: 'quintal', change: '0%', trend: 'stable' },
    'onion': { price: 38, unit: 'kg', change: '+10%', trend: 'up' }
  },
  'default': {
    'tomato': { price: 45, unit: 'kg', change: '+5%', trend: 'up' },
    'potato': { price: 28, unit: 'kg', change: '-2%', trend: 'down' },
    'wheat': { price: 2150, unit: 'quintal', change: '+3%', trend: 'up' },
    'rice': { price: 3200, unit: 'quintal', change: '+1%', trend: 'up' },
    'corn': { price: 1850, unit: 'quintal', change: '-1%', trend: 'down' },
    'onion': { price: 35, unit: 'kg', change: '+8%', trend: 'up' }
  }
};

// Get crop rates for a city
router.get('/rates/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const cityKey = city.toLowerCase();
    
    // Get rates for the city or use default
    const rates = CROP_RATES[cityKey] || CROP_RATES['default'];
    
    // Add some random variation to simulate real-time data
    const variatedRates = {};
    Object.keys(rates).forEach(crop => {
      const baseRate = rates[crop];
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const newPrice = Math.round(baseRate.price * (1 + variation));
      
      variatedRates[crop] = {
        ...baseRate,
        price: newPrice,
        lastUpdated: new Date().toISOString()
      };
    });

    res.json({
      success: true,
      data: {
        city: city,
        rates: variatedRates,
        lastUpdated: new Date().toISOString(),
        currency: 'INR'
      }
    });

  } catch (error) {
    console.error('Crop Rates Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop rates'
    });
  }
});

// Get rates for specific crops
router.get('/rates/:city/:crops', async (req, res) => {
  try {
    const { city, crops } = req.params;
    const cityKey = city.toLowerCase();
    const cropList = crops.split(',').map(c => c.toLowerCase().trim());
    
    const allRates = CROP_RATES[cityKey] || CROP_RATES['default'];
    const filteredRates = {};
    
    cropList.forEach(crop => {
      if (allRates[crop]) {
        const baseRate = allRates[crop];
        const variation = (Math.random() - 0.5) * 0.1;
        const newPrice = Math.round(baseRate.price * (1 + variation));
        
        filteredRates[crop] = {
          ...baseRate,
          price: newPrice,
          lastUpdated: new Date().toISOString()
        };
      }
    });

    res.json({
      success: true,
      data: {
        city: city,
        rates: filteredRates,
        lastUpdated: new Date().toISOString(),
        currency: 'INR'
      }
    });

  } catch (error) {
    console.error('Crop Rates Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop rates'
    });
  }
});

module.exports = router;