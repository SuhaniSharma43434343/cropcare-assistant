import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const CropSelectionBanner = ({ onSelectCrop, className = "", hasUserCrops = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-amber-50 border border-amber-200 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <Sprout className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-amber-800">
            {hasUserCrops ? 'Select Crop Type' : 'Add Crops to Profile'}
          </h3>
          <p className="text-sm text-amber-600">
            {hasUserCrops ? 'Choose your crop for accurate diagnosis' : 'Add crops to your profile to start scanning'}
          </p>
        </div>
        <Button
          size="sm"
          onClick={onSelectCrop}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {hasUserCrops ? 'Select' : 'Add Crops'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CropSelectionBanner;