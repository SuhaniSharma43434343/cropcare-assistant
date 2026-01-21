import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const CROP_OPTIONS = [
  { id: 'tomato', name: 'Tomato', icon: '🍅', description: 'Common vegetable crop' },
  { id: 'potato', name: 'Potato', icon: '🥔', description: 'Root vegetable' },
  { id: 'corn', name: 'Corn', icon: '🌽', description: 'Cereal grain' },
  { id: 'wheat', name: 'Wheat', icon: '🌾', description: 'Cereal grain' },
  { id: 'rice', name: 'Rice', icon: '🌾', description: 'Staple grain' },
  { id: 'pepper', name: 'Pepper', icon: '🌶️', description: 'Spicy vegetable' }
];

const CropContext = createContext();

export const CropProvider = ({ children }) => {
  const { user } = useAuth();
  const [selectedCropForDiagnosis, setSelectedCropForDiagnosis] = useState(null);
  const [userCrops, setUserCrops] = useState([]);

  // Sync user crops when user data changes
  useEffect(() => {
    if (user?.selectedCrops) {
      const crops = user.selectedCrops.map(cropId => 
        CROP_OPTIONS.find(crop => crop.id === cropId)
      ).filter(Boolean);
      setUserCrops(crops);
    } else {
      setUserCrops([]);
    }
  }, [user?.selectedCrops]);

  const getUserCrops = () => userCrops;
  const getPrimaryCrop = () => {
    if (userCrops.length > 0) {
      return userCrops[0];
    }
    return null;
  };
  const getCropById = (id) => CROP_OPTIONS.find(crop => crop.id === id);
  const getSelectedCropForDiagnosis = () => {
    if (selectedCropForDiagnosis) {
      return getCropById(selectedCropForDiagnosis);
    }
    return getPrimaryCrop();
  };

  const value = {
    selectedCropForDiagnosis,
    setSelectedCropForDiagnosis,
    getUserCrops,
    getPrimaryCrop,
    getCropById,
    getSelectedCropForDiagnosis,
    userCrops,
    setUserCrops,
    hasUserCrops: userCrops.length > 0
  };

  return (
    <CropContext.Provider value={value}>
      {children}
    </CropContext.Provider>
  );
};

export const useCrop = () => {
  const context = useContext(CropContext);
  if (!context) {
    throw new Error('useCrop must be used within a CropProvider');
  }
  return context;
};