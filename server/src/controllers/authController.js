const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Local storage for users when DB is unavailable
let localUsers = [];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'User already exists with this phone number' 
        });
      }

      const user = await User.create({ 
        phone, 
        password,
        profileComplete: false
      });
      const token = generateToken(user._id);

      return res.status(201).json({
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
    }

    // Fallback to local storage
    const existingUser = localUsers.find(u => u.phone === phone);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this phone number' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = Date.now().toString();
    const user = {
      id: userId,
      phone,
      password: hashedPassword,
      name: '',
      email: '',
      role: 'user',
      selectedCrops: [],
      primaryCrop: null,
      farmDetails: {},
      profileComplete: false
    };

    localUsers.push(user);
    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
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
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again.' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ phone });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }

      const token = generateToken(user._id);
      return res.json({
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
    }

    // Fallback to local storage
    const user = localUsers.find(u => u.phone === phone);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user.id);
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
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
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed. Please try again.' 
    });
  }
};

const getProfile = async (req, res) => {
  try {
    // Try MongoDB first
    if (mongoose.connection.readyState === 1 && req.user) {
      return res.json({
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
    }

    // Fallback to local storage
    const user = localUsers.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
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
    res.status(500).json({ success: false, message: error.message });
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

    // Try MongoDB first
    if (mongoose.connection.readyState === 1 && req.user) {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
      );

      return res.json({
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
    }

    // Fallback to local storage
    const userIndex = localUsers.findIndex(u => u.id === req.userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    localUsers[userIndex] = { ...localUsers[userIndex], ...updateData };
    const user = localUsers[userIndex];

    res.json({
      success: true,
      user: {
        id: user.id,
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
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };