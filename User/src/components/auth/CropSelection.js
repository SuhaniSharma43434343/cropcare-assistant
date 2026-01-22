import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sprout, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { CROP_OPTIONS } from '../../contexts/CropContext';

const CropSelection = ({ selectedCrops = [], onCropChange, onSave }) => {
  const [localSelected, setLocalSelected] = useState(selectedCrops);

  // Update local state when props change
  useEffect(() => {
    setLocalSelected(selectedCrops);
  }, [selectedCrops]);

  const handleCropToggle = (cropId) => {
    let newSelected;
    if (localSelected.includes(cropId)) {
      newSelected = localSelected.filter(id => id !== cropId);
    } else {
      if (localSelected.length >= 6) {
        return;
      }
      newSelected = [...localSelected, cropId];
    }
    
    setLocalSelected(newSelected);
    if (onCropChange) {
      onCropChange(newSelected);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(localSelected);
    } else if (onCropChange) {
      onCropChange(localSelected);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
          <Sprout className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Your Crops</h3>
        <p className="text-gray-600 text-sm mb-3">Choose up to 6 crops you grow</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
          <span>Selected: {localSelected.length}/6</span>
        </div>
      </div>

      {/* Crop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
        {CROP_OPTIONS.map((crop) => {
          const isSelected = localSelected.includes(crop.id);
          const isDisabled = !isSelected && localSelected.length >= 6;
          
          return (
            <motion.div
              key={crop.id}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary text-white shadow-lg'
                  : isDisabled
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                  : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50 hover:shadow-md'
              }`}
              onClick={() => !isDisabled && handleCropToggle(crop.id)}
            >
              <div className="flex items-center space-x-3">
                {/* Crop Icon */}
                <div className="flex-shrink-0">
                  <span className="text-3xl">{crop.icon}</span>
                </div>
                
                {/* Crop Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-base leading-tight ${
                    isSelected ? 'text-white' : 'text-gray-900'
                  }`}>
                    {crop.name}
                  </h4>
                  <p className={`text-sm mt-1 leading-tight ${
                    isSelected ? 'text-white/80' : 'text-gray-600'
                  }`}>
                    {crop.description}
                  </p>
                </div>
                
                {/* Selection Indicator */}
                <div className="flex-shrink-0">
                  {isSelected ? (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isDisabled ? 'border-gray-300' : 'border-gray-300 hover:border-primary/50'
                    }`}>
                      <Plus className={`w-4 h-4 ${
                        isDisabled ? 'text-gray-400' : 'text-gray-400 hover:text-primary'
                      }`} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Crops Summary */}
      {localSelected.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Crops:</h4>
          <div className="flex flex-wrap gap-2">
            {localSelected.map((cropId) => {
              const crop = CROP_OPTIONS.find(c => c.id === cropId);
              return crop ? (
                <span
                  key={cropId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                >
                  <span className="text-base">{crop.icon}</span>
                  <span>{crop.name}</span>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          onClick={handleSave}
          disabled={localSelected.length === 0}
          className="w-full py-3 text-base font-medium"
          size="lg"
        >
          {localSelected.length === 0 
            ? 'Select at least one crop' 
            : `Save ${localSelected.length} Crop${localSelected.length > 1 ? 's' : ''}`
          }
        </Button>
        
        {localSelected.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              setLocalSelected([]);
              if (onCropChange) {
                onCropChange([]);
              }
            }}
            className="w-full"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default CropSelection;