const FarmerRequest = require('../models/FarmerRequest');
const InvestorInterest = require('../models/InvestorInterest');
const Investor = require('../models/Investor');
const User = require('../models/User');

// Create farmer request
const createFarmerRequest = async (req, res) => {
  try {
    const { farmerName, cropType, location, landSize, investmentNeeded, equityOffered, taxRate, contactMobile, description } = req.body;
    
    const farmerRequest = new FarmerRequest({
      farmerId: req.user.id,
      farmerName,
      cropType,
      location,
      landSize,
      investmentNeeded,
      equityOffered,
      taxRate,
      contactMobile,
      description
    });

    await farmerRequest.save();
    res.status(201).json({ success: true, data: farmerRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all farmer requests with filters
const getFarmerRequests = async (req, res) => {
  try {
    const { cropType, location, minEquity, maxEquity } = req.query;
    
    let filter = { status: 'active' };
    
    if (cropType) {
      filter.cropType = new RegExp(cropType, 'i');
    }
    
    if (location) {
      filter.location = new RegExp(location, 'i');
    }
    
    if (minEquity || maxEquity) {
      filter.equityOffered = {};
      if (minEquity) filter.equityOffered.$gte = parseInt(minEquity);
      if (maxEquity) filter.equityOffered.$lte = parseInt(maxEquity);
    }

    const requests = await FarmerRequest.find(filter)
      .populate('farmerId', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get farmer's own requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await FarmerRequest.find({ farmerId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Express interest (investor)
const expressInterest = async (req, res) => {
  try {
    const { farmerRequestId, message } = req.body;
    
    const farmerRequest = await FarmerRequest.findById(farmerRequestId);
    if (!farmerRequest) {
      return res.status(404).json({ success: false, message: 'Farmer request not found' });
    }

    // Get investor ID (could be from investor auth or farmer auth for testing)
    const investorId = req.investor?.id || req.user?.id;
    if (!investorId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Check if interest already exists
    const existingInterest = await InvestorInterest.findOne({
      investorId,
      farmerRequestId
    });

    if (existingInterest) {
      return res.status(400).json({ success: false, message: 'Interest already expressed for this opportunity' });
    }

    // For testing: if using farmer auth, create a mock investor record
    let investorData;
    if (req.user && !req.investor) {
      // Using farmer auth for testing
      investorData = {
        _id: req.user.id,
        name: req.user.name || 'Test Investor',
        email: req.user.email || 'test@investor.com',
        phone: req.user.phone || '1234567890'
      };
    } else {
      // Using proper investor auth
      investorData = req.investor;
    }

    const interest = new InvestorInterest({
      investorId,
      farmerRequestId,
      farmerId: farmerRequest.farmerId,
      message: message || 'I am interested in investing in your farming project.'
    });

    await interest.save();

    // Update interest count
    await FarmerRequest.findByIdAndUpdate(farmerRequestId, {
      $inc: { interestCount: 1 }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Interest expressed successfully! The farmer will be notified.',
      data: interest 
    });
  } catch (error) {
    console.error('Express interest error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get interests for farmer
const getMyInterests = async (req, res) => {
  try {
    const interests = await InvestorInterest.find({ farmerId: req.user.id })
      .populate('farmerRequestId', 'cropType investmentNeeded equityOffered')
      .sort({ createdAt: -1 });

    // For each interest, get investor data (could be from Investor model or User model for testing)
    const populatedInterests = await Promise.all(
      interests.map(async (interest) => {
        let investorData;
        
        // Try to find in Investor model first
        const investor = await Investor.findById(interest.investorId).select('name email phone');
        
        if (investor) {
          investorData = investor;
        } else {
          // Fallback to User model for testing
          const user = await User.findById(interest.investorId).select('name email phone');
          investorData = user || {
            name: 'Test Investor',
            email: 'test@investor.com',
            phone: '1234567890'
          };
        }
        
        return {
          ...interest.toObject(),
          investorId: investorData
        };
      })
    );

    res.json({ success: true, data: populatedInterests });
  } catch (error) {
    console.error('Get my interests error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update interest status (farmer)
const updateInterestStatus = async (req, res) => {
  try {
    const { interestId, status } = req.body;
    
    const interest = await InvestorInterest.findOneAndUpdate(
      { _id: interestId, farmerId: req.user.id },
      { status },
      { new: true }
    ).populate('investorId', 'name email phone');

    if (!interest) {
      return res.status(404).json({ success: false, message: 'Interest not found' });
    }

    res.json({ success: true, data: interest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createFarmerRequest,
  getFarmerRequests,
  getMyRequests,
  expressInterest,
  getMyInterests,
  updateInterestStatus
};