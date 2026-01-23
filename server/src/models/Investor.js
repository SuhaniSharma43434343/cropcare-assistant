const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const investorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  investmentCapacity: {
    type: Number,
    default: 0
  },
  preferredCrops: [{
    type: String,
    trim: true
  }],
  preferredLocations: [{
    type: String,
    trim: true
  }],
  role: {
    type: String,
    default: 'investor'
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

investorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

investorSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Investor', investorSchema);