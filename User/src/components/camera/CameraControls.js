import { motion } from "framer-motion";
import { Camera, Upload, RotateCcw, X, Check, Image, Zap } from "lucide-react";
import { Button, IconButton, LoadingButton } from "../ui/button";

const CameraControls = ({
  onCapture,
  onUpload,
  onSwitchCamera,
  onRetake,
  onConfirm,
  hasMultipleCameras,
  isStreaming,
  capturedImage,
  isProcessing = false
}) => {
  // Show confirm/retake controls when image is captured
  if (capturedImage) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 safe-area-bottom"
      >
        <div className="container-sm py-6">
          {/* Preview Actions */}
          <div className="flex items-center justify-center gap-8 mb-4">
            {/* Retake Button */}
            <div className="text-center">
              <IconButton
                icon={X}
                label="Retake photo"
                onClick={onRetake}
                variant="outline"
                size="icon-lg"
                className="mb-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">Retake</p>
            </div>

            {/* Confirm Button */}
            <div className="text-center">
              <LoadingButton
                loading={isProcessing}
                onClick={onConfirm}
                className="w-20 h-20 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl mb-2"
                aria-label="Confirm and analyze photo"
              >
                {!isProcessing && <Check className="w-8 h-8" />}
              </LoadingButton>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {isProcessing ? 'Processing...' : 'Analyze'}
              </p>
            </div>

            {/* Upload Another */}
            <div className="text-center">
              <IconButton
                icon={Upload}
                label="Upload from gallery"
                onClick={onUpload}
                variant="outline"
                size="icon-lg"
                className="mb-2"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">Upload</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-1">
                  Ready for Analysis
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Our AI will analyze your image for diseases, pests, and nutrient deficiencies. 
                  This usually takes 10-15 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 safe-area-bottom"
    >
      <div className="container-sm py-6">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-8 mb-4">
          {/* Switch Camera / Upload */}
          <div className="text-center">
            {hasMultipleCameras ? (
              <IconButton
                icon={RotateCcw}
                label="Switch camera"
                onClick={onSwitchCamera}
                disabled={!isStreaming}
                variant="outline"
                size="icon-lg"
                className="mb-2"
              />
            ) : (
              <IconButton
                icon={Image}
                label="Upload from gallery"
                onClick={onUpload}
                variant="outline"
                size="icon-lg"
                className="mb-2"
              />
            )}
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {hasMultipleCameras ? "Flip" : "Gallery"}
            </p>
          </div>

          {/* Capture Button */}
          <div className="text-center">
            <LoadingButton
              loading={isProcessing}
              onClick={onCapture}
              disabled={!isStreaming}
              className={`
                w-20 h-20 rounded-full shadow-lg hover:shadow-xl mb-2 transition-all duration-200
                ${isStreaming
                  ? "bg-green-600 hover:bg-green-700 text-white hover:scale-105"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }
              `}
              aria-label="Capture photo"
            >
              {!isProcessing && <Camera className="w-8 h-8" />}
            </LoadingButton>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {isProcessing ? 'Capturing...' : 'Capture'}
            </p>
          </div>

          {/* Upload Button */}
          <div className="text-center">
            <IconButton
              icon={Upload}
              label="Upload image"
              onClick={onUpload}
              variant="outline"
              size="icon-lg"
              className="mb-2"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">Upload</p>
          </div>
        </div>

        {/* Status and Tips */}
        <div className="space-y-3">
          {/* Camera Status */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isStreaming ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {isStreaming ? 'Camera Ready' : 'Camera Initializing...'}
            </span>
          </div>

          {/* Quick Tips */}
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4"
            >
              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2 text-center">
                📸 Capture Tips
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-gray-400">
                <div className="text-center">
                  <div className="font-medium mb-1">🔆 Lighting</div>
                  <div>Use natural light when possible</div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-1">📏 Distance</div>
                  <div>Keep 6-12 inches from leaf</div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-1">🎯 Focus</div>
                  <div>Center the affected area</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="hidden md:block mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Space</kbd> to capture • 
            <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs ml-1">Esc</kbd> to go back
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CameraControls;