const jwt = require('jsonwebtoken');
const Investor = require('../models/Investor');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register investor
const registerInvestor = async (req, res) => {
  try {
    const { name, email, phone, password, investmentCapacity, preferredCrops, preferredLocations } = req.body;

    // Check if investor exists
    const existingInvestor = await Investor.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingInvestor) {
      return res.status(400).json({
        success: false,
        message: 'Investor already exists with this email or phone'
      });
    }

    const investor = new Investor({
      name,
      email,
      phone,
      password,
      investmentCapacity,
      preferredCrops,
      preferredLocations
    });

    await investor.save();

    const token = generateToken(investor._id);

    res.status(201).json({
      success: true,
      data: {
        investor: {
          id: investor._id,
          name: investor.name,
          email: investor.email,
          phone: investor.phone,
          role: investor.role
        },
        token
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login investor
const loginInvestor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const investor = await Investor.findOne({ email });
    if (!investor || !(await investor.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(investor._id);

    res.json({
      success: true,
      data: {
        investor: {
          id: investor._id,
          name: investor.name,
          email: investor.email,
          phone: investor.phone,
          role: investor.role
        },
        token
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get investor profile
const getInvestorProfile = async (req, res) => {
  try {
    const investor = await Investor.findById(req.investor.id).select('-password');
    res.json({ success: true, data: investor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update investor profile
const updateInvestorProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates here
    
    const investor = await Investor.findByIdAndUpdate(
      req.investor.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, data: investor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerInvestor,
  loginInvestor,
  getInvestorProfile,
  updateInvestorProfile
};