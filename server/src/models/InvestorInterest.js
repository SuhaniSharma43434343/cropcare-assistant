const mongoose = require('mongoose');

const investorInterestSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
    required: true
  },
  farmerRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FarmerRequest',
    required: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  notificationSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure one interest per investor per farmer request
investorInterestSchema.index({ investorId: 1, farmerRequestId: 1 }, { unique: true });

module.exports = mongoose.model('InvestorInterest', investorInterestSchema);