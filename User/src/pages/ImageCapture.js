import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Globe, 
  Camera, 
  Upload, 
  RotateCcw, 
  X, 
  Check,
  Zap,
  Info,
  Settings,
  Sprout
} from "lucide-react";
import { Button, LoadingButton, IconButton } from "../components/ui/button";
import MobileLayout from "../components/layout/MobileLayout";
import CameraView from "../components/camera/CameraView";
import CameraControls from "../components/camera/CameraControls";
import { useCamera } from "../hooks/useCamera";
import AlertBell from "../components/alerts/AlertBell";
import AlertCenter from "../components/alerts/AlertCenter";
import { useAlerts } from "../components/alerts/AlertProvider";
import { useCrop, CROP_OPTIONS } from "../contexts/CropContext";
import CropSelectionPopup from "../components/auth/CropSelectionPopup";
import CropSelectionBanner from "../components/CropSelectionBanner";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" }
];

const ImageCapture = () => {
  const navigate = useNavigate();
  const { selectedCropForDiagnosis, setSelectedCropForDiagnosis, getUserCrops, getSelectedCropForDiagnosis, hasUserCrops } = useCrop();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguages, setShowLanguages] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCropSelector, setShowCropSelector] = useState(false);
  const [showCropSelectionPopup, setShowCropSelectionPopup] = useState(false);
  const [showAlertCenter, setShowAlertCenter] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const [gridLines, setGridLines] = useState(true);
  const fileInputRef = useRef(null);
  const { showSuccess, showError, showInfo } = useAlerts();

  const userCrops = getUserCrops();
  const currentSelectedCrop = getSelectedCropForDiagnosis();

  const {
    videoRef,
    canvasRef,
    isStreaming,
    error,
    startCamera,
    stopCamera,
    captureImage,
    switchCamera,
    hasMultipleCameras,
  } = useCamera({ facingMode: "environment" });

  // Start camera on mount
  useEffect(() => {
    let mounted = true;
    
    const initCamera = async () => {
      if (mounted && !capturedImage) {
        await startCamera();
      }
    };
    
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(initCamera, 100);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
      stopCamera();
    };
  }, [startCamera, stopCamera, capturedImage]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && isStreaming && !capturedImage) {
        e.preventDefault();
        handleCapture();
      } else if (e.code === 'Escape') {
        if (capturedImage) {
          handleRetake();
        } else {
          navigate(-1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isStreaming, capturedImage]);

  const handleCapture = async () => {
    if (!isStreaming) return;
    
    setIsProcessing(true);
    showInfo('Capturing image...');
    
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
    
    // Simulate camera flash effect
    if (flashMode) {
      const flashElement = document.createElement('div');
      flashElement.className = 'fixed inset-0 bg-white z-50 pointer-events-none';
      flashElement.style.animation = 'flash 0.2s ease-out';
      document.body.appendChild(flashElement);
      setTimeout(() => document.body.removeChild(flashElement), 200);
    }
    
    setTimeout(() => {
      const image = captureImage();
      if (image) {
        setCapturedImage(image);
        showSuccess('Image captured successfully!');
      } else {
        showError('Failed to capture image. Please try again.');
      }
      setIsProcessing(false);
    }, 300);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    // Add a small delay before restarting camera to avoid conflicts
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      const selectedCrop = currentSelectedCrop;
      
      if (!selectedCrop) {
        showError('Please select a crop type first');
        setShowCropSelectionPopup(true);
        return;
      }
      
      if (userCrops.length > 1 && !selectedCropForDiagnosis) {
        setShowCropSelectionPopup(true);
        return;
      }
      
      sessionStorage.setItem("capturedImage", capturedImage);
      sessionStorage.setItem("captureSettings", JSON.stringify({
        language: selectedLanguage,
        selectedCrop: selectedCrop.id,
        selectedCropName: selectedCrop.name,
        timestamp: new Date().toISOString()
      }));
      navigate("/analyzing");
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showError('File size too large. Please select an image under 10MB.');
        return;
      }
      
      showInfo('Processing uploaded image...');
      
      // Stop camera first to avoid conflicts
      stopCamera();
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        setCapturedImage(result);
        showSuccess('Image uploaded successfully!');
      };
      reader.onerror = () => {
        showError('Failed to read the image file.');
        startCamera(); // Restart camera if file reading fails
      };
      reader.readAsDataURL(file);
    }
    
    // Clear the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  return (
    <MobileLayout showNav={false}>
      <div className="flex flex-col h-screen bg-gray-900 safe-area-top relative">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload image file"
        />

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-4 bg-black/50 backdrop-blur-md relative z-20"
        >
          <IconButton
            icon={ChevronLeft}
            label="Go back"
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-white hover:bg-white/10"
          />
          
          <h1 className="text-lg font-semibold text-white">
            Crop Scanner
          </h1>
          
          <div className="flex items-center gap-2">
            <AlertBell onClick={() => setShowAlertCenter(true)} />
            
            {/* Language Selector */}
            <div className="relative">
              <IconButton
                icon={Globe}
                label="Select language"
                onClick={() => setShowLanguages(!showLanguages)}
                variant="ghost"
                className="text-white hover:bg-white/10"
              />
              
              <AnimatePresence>
                {showLanguages && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-12 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 min-w-[200px] z-30"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setShowLanguages(false);
                        }}
                        className={`
                          flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors
                          ${selectedLanguage === lang.code
                            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }
                        `}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {selectedLanguage === lang.code && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings */}
            <IconButton
              icon={Settings}
              label="Camera settings"
              onClick={() => setShowSettings(!showSettings)}
              variant="ghost"
              className="text-white hover:bg-white/10"
            />
            
            {/* Crop Selector */}
            <IconButton
              icon={Sprout}
              label="Select crop"
              onClick={() => setShowCropSelector(!showCropSelector)}
              variant="ghost"
              className="text-white hover:bg-white/10"
            />
          </div>
        </motion.header>

        {/* Crop Selector Panel */}
        <AnimatePresence>
          {showCropSelector && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-16 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-30 min-w-[280px] max-h-[400px] overflow-y-auto"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Crop Selection
              </h3>
              
              {userCrops.length > 0 ? (
                <div className="space-y-2">
                  <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Current Selection</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg">{currentSelectedCrop?.icon}</span>
                      <span className="font-medium">{currentSelectedCrop?.name}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {currentSelectedCrop ? 'Change to different crop:' : 'Select a crop type:'}
                  </div>
                  
                  {userCrops.length > 1 && userCrops.filter(crop => crop.id !== selectedCropForDiagnosis).map((crop) => (
                    <button
                      key={crop.id}
                      onClick={() => {
                        setSelectedCropForDiagnosis(crop.id);
                        setShowCropSelector(false);
                        showSuccess(`Selected ${crop.name} for this diagnosis`);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
                    >
                      <span className="text-lg">{crop.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{crop.name}</div>
                        <div className="text-xs opacity-75">{crop.description}</div>
                      </div>
                    </button>
                  ))}}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Sprout className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    No crops selected in your profile
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate('/profile')}
                    className="text-xs"
                  >
                    Add Crops in Profile
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-16 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-30 min-w-[250px]"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Camera Settings
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Flash
                  </label>
                  <button
                    onClick={() => setFlashMode(!flashMode)}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative
                      ${flashMode ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                    `}
                  >
                    <div className={`
                      w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform
                      ${flashMode ? 'translate-x-6' : 'translate-x-0.5'}
                    `} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Grid Lines
                  </label>
                  <button
                    onClick={() => setGridLines(!gridLines)}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative
                      ${gridLines ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                    `}
                  >
                    <div className={`
                      w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform
                      ${gridLines ? 'translate-x-6' : 'translate-x-0.5'}
                    `} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera View */}
        <div className="flex-1 relative">
          {/* Crop Selection Banner */}
          {!hasUserCrops && (
            <div className="absolute top-4 left-4 right-4 z-20">
              <CropSelectionBanner 
                hasUserCrops={hasUserCrops}
                onSelectCrop={() => navigate('/profile')}
              />
            </div>
          )}
          
          {/* Debug: Add image upload test */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-4 left-4 z-40">
              <details className="bg-black/80 text-white p-2 rounded text-xs">
                <summary>Debug</summary>
                <div className="mt-2">
                  <p>Streaming: {isStreaming ? '✅' : '❌'}</p>
                  <p>Error: {error ? '❌' : '✅'}</p>
                  <p>Image: {capturedImage ? '✅' : '❌'}</p>
                </div>
              </details>
            </div>
          )}
          
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            isStreaming={isStreaming}
            error={error}
            capturedImage={capturedImage}
            showGrid={gridLines}
          />
          
          {/* Processing Overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-900 dark:text-white font-medium">
                    Processing image...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          {isStreaming && !capturedImage && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-32 left-4 right-4 text-center z-10"
            >
              <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 text-white">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Info className="w-5 h-5" />
                  <span className="font-medium">Scanning Tips</span>
                </div>
                <p className="text-sm opacity-90">
                  Position the affected leaf within the frame. Ensure good lighting for best results.
                </p>
                <p className="text-xs opacity-75 mt-2">
                  Press spacebar or tap the camera button to capture
                </p>
              </div>
            </motion.div>
          )}

          {/* Selected Crop Indicator */}
          {currentSelectedCrop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 bg-black/70 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 text-white text-sm z-10"
            >
              <span>{currentSelectedCrop.icon}</span>
              <span>{currentSelectedCrop.name}</span>
            </motion.div>
          )}

          {/* Language Indicator */}
          {selectedLang && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 left-4 bg-black/70 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 text-white text-sm z-10"
            >
              <span>{selectedLang.flag}</span>
              <span>{selectedLang.name}</span>
            </motion.div>
          )}
        </div>

        {/* Camera Controls */}
        <CameraControls
          onCapture={handleCapture}
          onUpload={handleUpload}
          onSwitchCamera={switchCamera}
          onRetake={handleRetake}
          onConfirm={handleConfirm}
          hasMultipleCameras={hasMultipleCameras}
          isStreaming={isStreaming}
          capturedImage={capturedImage}
          isProcessing={isProcessing}
        />
      </div>

      {/* Flash Animation Styles */}
      <style jsx>{`
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `}</style>
      
      <AlertCenter 
        isOpen={showAlertCenter} 
        onClose={() => setShowAlertCenter(false)} 
      />
      
      <CropSelectionPopup
        isOpen={showCropSelectionPopup}
        onClose={() => setShowCropSelectionPopup(false)}
        userCrops={userCrops}
        onSelectCrop={(cropId) => {
          setSelectedCropForDiagnosis(cropId);
          sessionStorage.setItem("capturedImage", capturedImage);
          sessionStorage.setItem("captureSettings", JSON.stringify({
            language: selectedLanguage,
            selectedCrop: cropId,
            timestamp: new Date().toISOString()
          }));
          navigate("/analyzing");
        }}
      />
    </MobileLayout>
  );
};

export default ImageCapture;