import { motion } from "framer-motion";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";

const CameraView = ({
  videoRef,
  canvasRef,
  isStreaming,
  error,
  capturedImage,
  showGrid = true,
  isUploadedImage = false
}) => {
  return (
    <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-green-950">
      {/* Mini Scanner Container */}
      <div className="scanner-container w-[90%] max-w-[450px] aspect-square rounded-[30px] overflow-hidden relative shadow-[0_20px_40px_rgba(0,0,0,0.4)] bg-black/20 backdrop-blur-2xl border border-white/10">
        
        {/* Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover rounded-[24px] ${capturedImage ? "hidden" : ""}`}
          style={{ transform: 'scaleX(-1)' }}
          onLoadedMetadata={() => {
            if (videoRef.current && !capturedImage) {
              videoRef.current.play().catch(console.warn);
            }
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
            className={`w-full h-full rounded-[24px] ${isUploadedImage ? 'object-contain bg-gray-900/50' : 'object-cover'}`}
          />
        )}

        {/* Glowing Neon Green Scanning Frame */}
        {(isStreaming || capturedImage) && (
          <div className="absolute inset-4 border-2 border-transparent rounded-2xl">
            {/* Glowing corners with pulse animation */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-green-400 rounded-tl-lg shadow-lg shadow-green-400/60 animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-green-400 rounded-tr-lg shadow-lg shadow-green-400/60 animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-green-400 rounded-bl-lg shadow-lg shadow-green-400/60 animate-pulse"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-green-400 rounded-br-lg shadow-lg shadow-green-400/60 animate-pulse"></div>
            
            {/* Scanning laser animation */}
            {isStreaming && !capturedImage && (
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-lg shadow-green-400/60"
                animate={{ y: [0, 280, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        )}

        {/* Loading State */}
        {!isStreaming && !capturedImage && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-md rounded-[24px] flex flex-col items-center justify-center text-white"
          >
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-lg font-medium mb-2">Starting Camera</p>
            <p className="text-sm opacity-75 text-center px-4">
              Please allow camera access
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-[24px] flex flex-col items-center justify-center text-white p-6"
          >
            <div className="bg-red-500/20 rounded-full p-4 mb-4">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-center">
              Camera Access Required
            </h3>
            
            <p className="text-sm text-gray-300 text-center mb-6 max-w-sm">
              {error.includes("Permission") 
                ? "Please allow camera access to scan your crops."
                : "Camera unavailable. Please try again."}
            </p>
          </motion.div>
        )}
      </div>

      {/* Connection Status */}
      <div className="absolute top-4 right-4 z-30">
        {navigator.onLine ? (
          <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs backdrop-blur-md">
            <Wifi className="w-3 h-3" />
            Online
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs backdrop-blur-md">
            <WifiOff className="w-3 h-3" />
            Offline
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraView;