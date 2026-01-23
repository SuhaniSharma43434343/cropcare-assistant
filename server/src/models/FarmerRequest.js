const mongoose = require('mongoose');

const farmerRequestSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmerName: {
    type: String,
    required: true,
    trim: true
  },
  cropType: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  landSize: {
    type: Number,
    required: true,
    min: 0
  },
  investmentNeeded: {
    type: Number,
    required: true,
    min: 0
  },
  equityOffered: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  taxRate: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  contactMobile: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'funded', 'cancelled'],
    default: 'active'
  },
  interestCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FarmerRequest', farmerRequestSchema);