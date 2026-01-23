import { useState, useRef } from 'react';
import { Camera, X, Upload, Scan } from 'lucide-react';

const CropScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleAnalyze = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCapturedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <h1 className="text-white text-xl font-light tracking-wide text-center">Crop Scanner</h1>
      </div>

      {/* Main Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        
        {/* Camera Viewfinder */}
        <div className="relative mb-12">
          <div className={`w-80 h-80 rounded-3xl bg-black/30 backdrop-blur-xl border border-white/20 overflow-hidden relative ${isScanning ? 'animate-pulse' : ''}`}>
            
            {/* Scanning Frame */}
            <div className="absolute inset-4 border-2 border-transparent rounded-2xl">
              {/* Glowing corners */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-green-400 rounded-tl-lg animate-pulse shadow-lg shadow-green-400/50"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-green-400 rounded-tr-lg animate-pulse shadow-lg shadow-green-400/50"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-green-400 rounded-bl-lg animate-pulse shadow-lg shadow-green-400/50"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-green-400 rounded-br-lg animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>

            {/* Camera Content */}
            <div className="w-full h-full flex items-center justify-center">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured crop" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-white/60 mx-auto mb-4" />
                  <p className="text-white/60 text-sm">Position crop in frame</p>
                </div>
              )}
            </div>

            {/* Scanning Animation Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-green-400/20 rounded-2xl">
                <div className="w-full h-1 bg-green-400 animate-ping"></div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-8">
          
          {/* Retake Button */}
          <button 
            onClick={handleRetake}
            className="w-16 h-16 rounded-full bg-red-500/20 backdrop-blur-md border border-red-400/30 flex items-center justify-center hover:bg-red-500/30 transition-all duration-300"
          >
            <X className="w-6 h-6 text-red-400" />
          </button>

          {/* Analyze Button */}
          <button 
            onClick={handleAnalyze}
            disabled={!capturedImage}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              capturedImage 
                ? 'bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/50 animate-pulse' 
                : 'bg-gray-600/50 cursor-not-allowed'
            }`}
          >
            <Scan className="w-8 h-8 text-white" />
          </button>

          {/* Upload Button */}
          <button 
            onClick={handleUpload}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          >
            <Upload className="w-6 h-6 text-white/80" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Status Text */}
        <div className="mt-8 text-center">
          {isScanning ? (
            <p className="text-green-400 text-sm animate-pulse">Analyzing crop...</p>
          ) : capturedImage ? (
            <p className="text-white/60 text-sm">Tap analyze to scan for diseases</p>
          ) : (
            <p className="text-white/60 text-sm">Capture or upload crop image</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropScanner;