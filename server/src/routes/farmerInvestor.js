const express = require('express');
const router = express.Router();
const FarmRequest = require('../models/FarmRequest');
const auth = require('../middleware/auth');

// Submit farmer request
router.post('/farmer-request', async (req, res) => {
  try {
    const { type, ...requestData } = req.body;
    const userId = 'anonymous_' + Date.now();
    const userName = requestData.contactMobile || 'Anonymous User';

    // Validate required fields based on request type
    const validateRequest = (type, data) => {
      const errors = [];
      
      // Common validations
      if (!data.location?.trim()) errors.push('Location is required');
      if (!data.contactMobile?.trim()) errors.push('Contact mobile is required');
      
      if (type === 'Request for Machinery') {
        if (!data.machinery?.trim()) errors.push('Machinery type is required');
        if (!data.duration || data.duration < 1) errors.push('Duration must be at least 1 day');
      }
      
      if (type === 'Request for Loan') {
        if (!data.amount || data.amount <= 0) errors.push('Amount must be greater than 0');
        if (!data.equity || data.equity < 0 || data.equity > 100) errors.push('Equity must be between 0-100%');
      }
      
      if (type === 'Request for Labour') {
        if (!data.startDate) errors.push('Start date is required');
        if (!data.endDate) errors.push('End date is required');
        if (!data.dailyPayment || data.dailyPayment <= 0) errors.push('Daily payment must be greater than 0');
        if (new Date(data.startDate) >= new Date(data.endDate)) errors.push('End date must be after start date');
      }
      
      if (type === 'Inventory Rent') {
        if (!data.inventory?.trim()) errors.push('Equipment list is required');
      }
      
      if (type === 'Loan') {
        if (!data.amount || data.amount <= 0) errors.push('Amount must be greater than 0');
        if (!data.minEquity || data.minEquity < 0 || data.minEquity > 100) errors.push('Minimum equity must be between 0-100%');
      }
      
      return errors;
    };

    const validationErrors = validateRequest(type, requestData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Map request type to database format
    const requestTypeMap = {
      'Request for Machinery': 'machinery',
      'Request for Loan': 'funding',
      'Request for Labour': 'labour',
      'Inventory Rent': 'equipment',
      'Loan': 'investor_funding'
    };

    const farmRequest = new FarmRequest({
      farmerId: userId,
      farmerName: userName,
      requestType: requestTypeMap[type],
      location: requestData.location,
      contactMobile: requestData.contactMobile,
      description: requestData.description || '',
      
      // Type-specific fields
      ...(type === 'Request for Machinery' && {
        machineryType: requestData.machinery,
        duration: parseInt(requestData.duration)
      }),
      
      ...(type === 'Request for Loan' && {
        amount: parseFloat(requestData.amount),
        equity: parseFloat(requestData.equity),
        cropType: requestData.cropType,
        landSize: parseFloat(requestData.landSize)
      }),
      
      ...(type === 'Request for Labour' && {
        startDate: new Date(requestData.startDate),
        endDate: new Date(requestData.endDate),
        dailyPayment: parseFloat(requestData.dailyPayment),
        workersNeeded: parseInt(requestData.workersNeeded) || 1
      }),
      
      ...(type === 'Inventory Rent' && {
        inventory: requestData.inventory
      }),
      
      ...(type === 'Loan' && {
        amount: parseFloat(requestData.amount),
        minEquity: parseFloat(requestData.minEquity)
      })
    });

    await farmRequest.save();

    res.json({
      success: true,
      message: 'Request submitted successfully',
      requestId: farmRequest._id,
      request: farmRequest
    });

  } catch (error) {
    console.error('Farmer request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit request',
      error: error.message
    });
  }
});

// Get all farmer requests (for thekedars)
router.get('/requests', auth, async (req, res) => {
  try {
    const { type, location, status = 'pending' } = req.query;
    
    const filter = { status };
    if (type) filter.requestType = type;
    if (location) filter.location = new RegExp(location, 'i');

    const requests = await FarmRequest.find(filter)
      .populate('farmerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      requests: requests.map(req => ({
        id: req._id,
        farmerName: req.farmerName,
        requestType: req.requestType,
        location: req.location,
        contactMobile: req.contactMobile,
        description: req.description,
        status: req.status,
        createdAt: req.createdAt,
        responseCount: req.responseCount,
        
        // Type-specific data
        ...(req.requestType === 'machinery' && {
          machineryType: req.machineryType,
          duration: req.duration
        }),
        
        ...(req.requestType === 'funding' && {
          amount: req.amount,
          equity: req.equity,
          cropType: req.cropType,
          landSize: req.landSize
        }),
        
        ...(req.requestType === 'labour' && {
          startDate: req.startDate,
          endDate: req.endDate,
          dailyPayment: req.dailyPayment,
          workersNeeded: req.workersNeeded
        }),
        
        ...(req.requestType === 'equipment' && {
          inventory: req.inventory
        }),
        
        ...(req.requestType === 'investor_funding' && {
          amount: req.amount,
          minEquity: req.minEquity
        })
      }))
    });

  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
      error: error.message
    });
  }
});

// Respond to farmer request (for thekedars)
router.post('/respond/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { message, contactInfo } = req.body;
    const thekedarsId = req.user.id;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required'
      });
    }

    const farmRequest = await FarmRequest.findById(requestId);
    if (!farmRequest) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (farmRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is no longer accepting responses'
      });
    }

    // Check if thekedar already responded
    const existingResponse = farmRequest.responses.find(
      resp => resp.thekedarsId.toString() === thekedarsId
    );

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: 'You have already responded to this request'
      });
    }

    // Add response
    farmRequest.responses.push({
      thekedarsId,
      message: message.trim(),
      contactInfo: contactInfo?.trim() || req.user.email
    });

    farmRequest.responseCount += 1;
    farmRequest.status = 'active'; // Mark as active once it has responses

    await farmRequest.save();

    res.json({
      success: true,
      message: 'Response submitted successfully'
    });

  } catch (error) {
    console.error('Response error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit response',
      error: error.message
    });
  }
});

// Get farmer's own requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const requests = await FarmRequest.find({ farmerId: userId })
      .sort({ createdAt: -1 })
      .populate('responses.thekedarsId', 'name email');

    res.json({
      success: true,
      requests: requests.map(req => ({
        id: req._id,
        requestType: req.requestType,
        location: req.location,
        status: req.status,
        createdAt: req.createdAt,
        responseCount: req.responseCount,
        responses: req.responses.map(resp => ({
          thekedarsName: resp.thekedarsId.name,
          message: resp.message,
          contactInfo: resp.contactInfo,
          respondedAt: resp.respondedAt
        })),
        
        // Include all type-specific fields
        ...(req.requestType === 'machinery' && {
          machineryType: req.machineryType,
          duration: req.duration
        }),
        
        ...(req.requestType === 'funding' && {
          amount: req.amount,
          equity: req.equity,
          cropType: req.cropType,
          landSize: req.landSize
        }),
        
        ...(req.requestType === 'labour' && {
          startDate: req.startDate,
          endDate: req.endDate,
          dailyPayment: req.dailyPayment,
          workersNeeded: req.workersNeeded
        }),
        
        ...(req.requestType === 'equipment' && {
          inventory: req.inventory
        }),
        
        ...(req.requestType === 'investor_funding' && {
          amount: req.amount,
          minEquity: req.minEquity
        })
      }))
    });

  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your requests',
      error: error.message
    });
  }
});

module.exports = router;