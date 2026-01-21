const mongoose = require('mongoose');

const scanRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop_name: {
    type: String,
    required: true
  },
  disease_name: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  severity: {
    type: String,
    required: true,
    enum: ['Healthy', 'Mild', 'Moderate', 'Severe']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  mlResult: {
    type: mongoose.Schema.Types.Mixed // Store full ML response
  }
}, {
  timestamps: true
});

// Index for efficient queries
scanRecordSchema.index({ userId: 1, timestamp: -1 });
scanRecordSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ScanRecord', scanRecordSchema);