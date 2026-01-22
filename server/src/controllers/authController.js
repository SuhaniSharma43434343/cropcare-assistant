const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    const user = await User.create({ 
      phone, 
      password,
      profileComplete: false
    });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        selectedCrops: user.selectedCrops,
        primaryCrop: user.primaryCrop,
        farmDetails: user.farmDetails,
        profileComplete: user.profileComplete
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        selectedCrops: user.selectedCrops,
        primaryCrop: user.primaryCrop,
        farmDetails: user.farmDetails,
        profileComplete: user.profileComplete
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        phone: req.user.phone,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        selectedCrops: req.user.selectedCrops,
        primaryCrop: req.user.primaryCrop,
        farmDetails: req.user.farmDetails,
        profileComplete: req.user.profileComplete
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, selectedCrops, primaryCrop, farmDetails } = req.body;
    
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(selectedCrops && { selectedCrops }),
      ...(primaryCrop && { primaryCrop }),
      ...(farmDetails && { farmDetails }),
      profileComplete: true
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        selectedCrops: user.selectedCrops,
        primaryCrop: user.primaryCrop,
        farmDetails: user.farmDetails,
        profileComplete: user.profileComplete
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };