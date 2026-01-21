import { motion } from "framer-motion";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";

const CameraView = ({
  videoRef,
  canvasRef,
  isStreaming,
  error,
  capturedImage,
  showGrid = true
}) => {
  return (
    <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`
          w-full h-full object-cover
          ${capturedImage ? "hidden" : ""}
        `}
        style={{ transform: 'scaleX(-1)' }} // Mirror for selfie mode
        onLoadedMetadata={() => {
          // Ensure video plays when metadata is loaded
          if (videoRef.current && !capturedImage) {
            videoRef.current.play().catch(console.warn);
          }
        }}
        onError={(e) => {
          console.warn('Video element error:', e);
        }}
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Captured Image Preview */}
      {capturedImage && (
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          src={capturedImage}
          alt="Captured crop"
          className="w-full h-full object-cover"
        />
      )}

      {/* Grid Lines Overlay */}
      {showGrid && (isStreaming || capturedImage) && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Rule of thirds grid */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Vertical lines */}
            <line x1="33.33" y1="0" x2="33.33" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
            <line x1="66.66" y1="0" x2="66.66" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
            {/* Horizontal lines */}
            <line x1="0" y1="33.33" x2="100" y2="33.33" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
            <line x1="0" y1="66.66" x2="100" y2="66.66" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
          </svg>
        </div>
      )}

      {/* Loading State */}
      {!isStreaming && !capturedImage && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white"
        >
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-lg font-medium mb-2">Starting Camera</p>
          <p className="text-sm opacity-75 text-center px-4">
            Please allow camera access when prompted
          </p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white p-6"
        >
          <div className="bg-red-500/20 rounded-full p-4 mb-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-center">
            Camera Access Required
          </h3>
          
          <p className="text-sm text-gray-300 text-center mb-6 max-w-sm">
            {error.includes("Permission") 
              ? "Please allow camera access to scan your crops. Check your browser settings and try again."
              : error.includes("NotFound")
              ? "No camera found on this device. Please connect a camera or try a different device."
              : error.includes("NotReadable")
              ? "Camera is being used by another application. Please close other camera apps and try again."
              : error
            }
          </p>

          {/* Troubleshooting Tips */}
          <div className="bg-gray-800/50 rounded-xl p-4 max-w-sm">
            <h4 className="font-medium mb-2 text-center">Troubleshooting Tips:</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Refresh the page and allow camera access</li>
              <li>• Check browser permissions in settings</li>
              <li>• Try using a different browser</li>
              <li>• Ensure no other apps are using the camera</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Leaf Detection Frame - Only show when streaming or captured */}
      {(isStreaming || capturedImage) && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          {/* Detection Frame */}
          <div className="relative w-80 h-80 max-w-[80vw] max-h-[60vh]">
            {/* Animated Border */}
            <div className="absolute inset-0 border-2 border-dashed border-green-400 rounded-3xl animate-pulse-ring" />
            
            {/* Corner Markers */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-2xl" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-2xl" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-2xl" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-2xl" />
            
            {/* Center Focus Point */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-green-400 rounded-full bg-green-400/20" />
            </div>
            
            {/* Scanning Line Animation */}
            {isStreaming && !capturedImage && (
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                animate={{ y: [0, 320, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Connection Status Indicator */}
      <div className="absolute top-4 right-4 z-30">
        {navigator.onLine ? (
          <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
            <Wifi className="w-3 h-3" />
            Online
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs">
            <WifiOff className="w-3 h-3" />
            Offline
          </div>
        )}
      </div>

      {/* Capture Success Animation */}
      {capturedImage && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
        >
          <div className="bg-green-500 rounded-full p-3 shadow-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              ✓
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CameraView;