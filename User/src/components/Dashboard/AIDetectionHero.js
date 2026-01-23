import React, { useState } from 'react';
import { CameraIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const AIDetectionHero = ({ lastDetection }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle file drop logic here
  };

  return (
    <div className="hero-gradient rounded-xl shadow-lg p-8 text-white dashboard-card">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex-1 mb-6 lg:mb-0 lg:pr-8">
          <h2 className="text-3xl font-bold mb-3">AI Plant Disease Detection</h2>
          <p className="text-emerald-100 mb-6 text-lg">
            Upload or scan your plant images for instant AI-powered analysis and treatment recommendations
          </p>
          
          {lastDetection && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-100">Last Detection Result</p>
                  <p className="text-white font-semibold">
                    {lastDetection.disease} ({lastDetection.confidence}% Confidence)
                  </p>
                </div>
                <button className="text-emerald-200 hover:text-white text-sm underline focus-ring rounded">
                  View Treatment →
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-primary bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 dashboard-transition focus-ring flex items-center justify-center">
              <CameraIcon className="h-5 w-5 mr-2" />
              Take Photo
            </button>
            <button className="btn-primary bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 dashboard-transition focus-ring flex items-center justify-center">
              <PhotoIcon className="h-5 w-5 mr-2" />
              Upload Image
            </button>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <div 
            className={`w-64 h-40 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-dashed transition-all duration-300 ${
              isDragOver ? 'border-white bg-white/20' : 'border-white/30'
            } flex items-center justify-center cursor-pointer hover:bg-white/15`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <ArrowUpTrayIcon className="h-12 w-12 mx-auto mb-3 text-white/80" />
              <p className="text-sm text-white/80 mb-1">Drag & Drop Image Here</p>
              <p className="text-xs text-white/60">or click to browse</p>
              <div className="mt-3 text-xs text-white/60">
                Supports: JPG, PNG, HEIC
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Processing Indicator */}
      <div className="mt-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-emerald-200">
          <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
          <span className="text-sm">AI Engine Ready • Python ML Service Online</span>
        </div>
      </div>
    </div>
  );
};

export default AIDetectionHero;