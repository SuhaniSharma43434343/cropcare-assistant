const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  contactMobile: {
    type: String,
    trim: true,
    default: function() { return this.phone; }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    lowercase: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  selectedCrops: [{
    type: String,
    enum: ['apple', 'banana', 'coffee', 'corn', 'cotton', 'eggplant', 'grapes', 'guava', 'mango', 'okra', 'potato', 'rice', 'sugarcane', 'tea', 'tomato', 'wheat']
  }],
  primaryCrop: {
    type: String,
    enum: ['apple', 'banana', 'coffee', 'corn', 'cotton', 'eggplant', 'grapes', 'guava', 'mango', 'okra', 'potato', 'rice', 'sugarcane', 'tea', 'tomato', 'wheat']
  },
  farmDetails: {
    location: String,
    size: {
      type: String,
      enum: ['small', 'medium', 'large']
    }
  },
  profileComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);