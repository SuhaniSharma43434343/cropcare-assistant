// Diagnosis controller deprecated - all diagnosis data now comes from AI/ML analysis
// These endpoints return deprecation messages

const getDiagnoses = async (req, res) => {
  res.status(410).json({ 
    success: false,
    message: 'This endpoint is deprecated. All diagnosis data now comes from AI/ML image analysis.' 
  });
};

const createDiagnosis = async (req, res) => {
  res.status(410).json({ 
    success: false,
    message: 'This endpoint is deprecated. All diagnosis data now comes from AI/ML image analysis.' 
  });
};

const updateDiagnosis = async (req, res) => {
  res.status(410).json({ 
    success: false,
    message: 'This endpoint is deprecated. All diagnosis data now comes from AI/ML image analysis.' 
  });
};

module.exports = { getDiagnoses, createDiagnosis, updateDiagnosis };