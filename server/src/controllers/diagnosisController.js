const Diagnosis = require('../models/Diagnosis');

const getDiagnoses = async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find({ user: req.user._id })
      .populate('crop');
    res.json({ success: true, diagnoses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDiagnosis = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.create({
      ...req.body,
      user: req.user._id
    });
    
    const populatedDiagnosis = await Diagnosis.findById(diagnosis._id)
      .populate('crop');
      
    res.status(201).json({ success: true, diagnosis: populatedDiagnosis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDiagnosis = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    ).populate('crop');
    
    if (!diagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found' });
    }
    
    res.json({ success: true, diagnosis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDiagnoses, createDiagnosis, updateDiagnosis };