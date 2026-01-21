import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sprout } from 'lucide-react';
import { CROP_OPTIONS } from '../../contexts/CropContext';

const CropSelection = ({ selectedCrops = [], onCropChange }) => {
  const [localSelected, setLocalSelected] = useState(selectedCrops);

  const handleCropToggle = (cropId) => {
    let newSelected;
    if (localSelected.includes(cropId)) {
      newSelected = localSelected.filter(id => id !== cropId);
    } else {
      if (localSelected.length >= 6) {
        return; // Max 6 crops
      }
      newSelected = [...localSelected, cropId];
    }
    
    setLocalSelected(newSelected);
    onCropChange(newSelected);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Sprout className="w-12 h-12 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Your Crops</h3>
        <p className="text-gray-600 text-sm">Choose up to 6 crops you grow (selected: {localSelected.length}/6)</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CROP_OPTIONS.map((crop) => (
          <motion.div
            key={crop.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
              localSelected.includes(crop.id)
                ? 'border-primary bg-primary text-white'
                : localSelected.length >= 6
                ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleCropToggle(crop.id)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{crop.icon}</span>
              <div className="flex-1">
                <h4 className={`font-medium ${
                  localSelected.includes(crop.id) ? 'text-white' : 'text-gray-900'
                }`}>{crop.name}</h4>
                <p className={`text-xs ${
                  localSelected.includes(crop.id) ? 'text-white/80' : 'text-gray-500'
                }`}>{crop.description}</p>
              </div>
              {localSelected.includes(crop.id) && (
                <Check className="w-5 h-5 text-white" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CropSelection;