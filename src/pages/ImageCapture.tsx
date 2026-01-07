import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, ChevronLeft, Globe, Flashlight, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/layout/MobileLayout";

const languages = ["English", "हिंदी", "मराठी", "తెలుగు", "தமிழ்"];

const ImageCapture = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguages, setShowLanguages] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = () => {
    // Simulate capture
    setCapturedImage("/placeholder.svg");
    setTimeout(() => {
      navigate("/analyzing");
    }, 500);
  };

  const handleUpload = () => {
    // Simulate upload
    navigate("/analyzing");
  };

  return (
    <MobileLayout showNav={false}>
      <div className="flex flex-col h-screen bg-foreground/95 safe-area-top">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 relative z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <h1 className="text-lg font-display font-semibold text-primary-foreground">
            Scan Crop
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLanguages(!showLanguages)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Globe className="w-5 h-5" />
          </Button>
        </div>

        {/* Language Selector */}
        {showLanguages && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 right-4 z-30 bg-card rounded-xl p-2 shadow-lg"
          >
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLanguage(lang);
                  setShowLanguages(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedLanguage === lang
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {lang}
              </button>
            ))}
          </motion.div>
        )}

        {/* Camera View */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {/* Simulated Camera View */}
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/90 to-foreground/80" />
          
          {/* Leaf Outline Guide */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-72 h-80"
          >
            {/* Outer Glow */}
            <div className="absolute inset-0 rounded-[60px] border-2 border-dashed border-primary/50 animate-pulse-ring" />
            
            {/* Main Outline */}
            <svg
              viewBox="0 0 200 240"
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M100 20 C60 40, 30 80, 30 140 C30 200, 70 220, 100 220 C130 220, 170 200, 170 140 C170 80, 140 40, 100 20"
                className="text-primary stroke-[2.5]"
                strokeDasharray="8 4"
              />
              {/* Center Vein */}
              <path
                d="M100 40 L100 200"
                className="text-primary/60"
                strokeWidth="1.5"
              />
              {/* Side Veins */}
              <path
                d="M100 60 L60 90 M100 90 L50 130 M100 120 L55 160 M100 150 L65 185"
                className="text-primary/40"
                strokeWidth="1"
              />
              <path
                d="M100 60 L140 90 M100 90 L150 130 M100 120 L145 160 M100 150 L135 185"
                className="text-primary/40"
                strokeWidth="1"
              />
            </svg>

            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl" />
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-32 left-0 right-0 text-center"
          >
            <p className="text-primary-foreground/80 text-sm font-medium">
              Position the leaf within the frame
            </p>
            <p className="text-primary-foreground/50 text-xs mt-1">
              Ensure good lighting for best results
            </p>
          </motion.div>
        </div>

        {/* Camera Controls */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-card rounded-t-3xl pt-6 pb-8 px-6 safe-area-bottom"
        >
          <div className="flex items-center justify-around">
            {/* Flash Toggle */}
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() => setFlashOn(!flashOn)}
              className={flashOn ? "text-warning" : "text-muted-foreground"}
            >
              <Flashlight className="w-6 h-6" />
            </Button>

            {/* Capture Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCapture}
              className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow"
            >
              <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary-foreground" />
              </div>
            </motion.button>

            {/* Upload Button */}
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={handleUpload}
              className="text-muted-foreground"
            >
              <Upload className="w-6 h-6" />
            </Button>
          </div>

          {/* Action Labels */}
          <div className="flex items-center justify-around mt-3">
            <span className="text-xs text-muted-foreground">Flash</span>
            <span className="text-xs text-foreground font-medium">Capture</span>
            <span className="text-xs text-muted-foreground">Gallery</span>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default ImageCapture;
