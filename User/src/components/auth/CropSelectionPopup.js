import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Button } from '../ui/button';

const CropSelectionPopup = ({ isOpen, onClose, userCrops, onSelectCrop }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-background rounded-2xl p-6 w-full max-w-sm shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Select Crop Type</h3>
            <Button size="icon-sm" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Choose the crop type for accurate diagnosis:
          </p>
          
          <div className="space-y-2">
            {userCrops.map((crop) => (
              <button
                key={crop.id}
                onClick={() => onSelectCrop(crop.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <span className="text-2xl">{crop.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{crop.name}</div>
                  <div className="text-xs text-muted-foreground">{crop.description}</div>
                </div>
                <Check className="w-4 h-4 text-primary" />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CropSelectionPopup;