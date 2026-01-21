const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  },
  diseaseName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100
  },
  symptoms: [{
    type: String
  }],
  recommendedTreatment: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'treated'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);