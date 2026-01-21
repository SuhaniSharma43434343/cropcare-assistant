// Crop controller deprecated - all crop data now comes from AI/ML analysis
// These endpoints return deprecation messages

const getCrops = async (req, res) => {
  res.status(410).json({ 
    success: false,
    message: 'This endpoint is deprecated. Crop identification now comes from AI/ML image analysis.' 
  });
};

const createCrop = async (req, res) => {
  res.status(410).json({ 
    success: false,
    message: 'This endpoint is deprecated. Crop identification now comes from AI/ML image analysis.' 
  });
};

const updateCrop = async (req, res) => {
  res.status(410).json({ 
    success: false,
    message: 'This endpoint is deprecated. Crop identification now comes from AI/ML image analysis.' 
  });
};

const deleteCrop = async (req, res) => {
  res.status(410).json({ 
    success: false,
    message: 'This endpoint is deprecated. Crop identification now comes from AI/ML image analysis.' 
  });
};

module.exports = { getCrops, createCrop, updateCrop, deleteCrop };