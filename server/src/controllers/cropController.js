const Crop = require('../models/Crop');

const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ user: req.user._id });
    res.json({ success: true, crops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCrop = async (req, res) => {
  try {
    const crop = await Crop.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json({ success: true, crop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    
    res.json({ success: true, crop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    
    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCrops, createCrop, updateCrop, deleteCrop };