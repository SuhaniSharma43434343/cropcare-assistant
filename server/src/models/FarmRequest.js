const mongoose = require('mongoose');

const farmRequestSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.Mixed, // Allow ObjectId or String for anonymous users
    required: false
  },
  farmerName: {
    type: String,
    required: true,
    trim: true
  },
  requestType: {
    type: String,
    enum: ['machinery', 'funding', 'labour', 'equipment', 'investor_funding'],
    required: true
  },
  // Common fields
  location: {
    type: String,
    required: true,
    trim: true
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
    enum: ['pending', 'active', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  
  // Machinery request fields
  machineryType: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // days
    min: 1
  },
  
  // Funding request fields
  amount: {
    type: Number,
    min: 0
  },
  equity: {
    type: Number,
    min: 0,
    max: 100
  },
  cropType: {
    type: String,
    trim: true
  },
  landSize: {
    type: Number,
    min: 0
  },
  
  // Labour request fields
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  dailyPayment: {
    type: Number,
    min: 0
  },
  workersNeeded: {
    type: Number,
    min: 1,
    default: 1
  },
  
  // Equipment rental fields
  inventory: {
    type: String,
    trim: true
  },
  
  // Investor funding fields
  minEquity: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // Response tracking
  responseCount: {
    type: Number,
    default: 0
  },
  responses: [{
    investorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    contactInfo: String,
    respondedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
farmRequestSchema.index({ requestType: 1, status: 1, location: 1 });
farmRequestSchema.index({ farmerId: 1, createdAt: -1 });

module.exports = mongoose.model('FarmRequest', farmRequestSchema);