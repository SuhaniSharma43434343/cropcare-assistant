import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle, Share2, Bookmark, ChevronRight, Leaf } from "lucide-react";
import { Button } from "../components/ui/button";
import MobileLayout from "../components/layout/MobileLayout";
import { useEffect, useState } from "react";
import { useAlerts } from "../components/alerts/AlertProvider";

const Diagnosis = () => {
  const navigate = useNavigate();
  const { showError } = useAlerts();
  const [diagnosis, setDiagnosis] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    // Get diagnosis result from session storage
    const diagnosisResult = sessionStorage.getItem('diagnosisResult');
    const capturedImageData = sessionStorage.getItem('capturedImage');
    
    if (!diagnosisResult) {
      showError('No diagnosis result found. Please scan an image first.');
      navigate('/capture');
      return;
    }
    
    try {
      const parsedResult = JSON.parse(diagnosisResult);
      setDiagnosis(parsedResult);
      setCapturedImage(capturedImageData);
    } catch (error) {
      console.error('Error parsing diagnosis result:', error);
      showError('Invalid diagnosis data. Please try scanning again.');
      navigate('/capture');
    }
  }, [navigate, showError]);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "low":
      case "mild":
        return "bg-success/10 text-success border-success/30";
      case "medium":
      case "moderate":
        return "bg-warning/10 text-warning border-warning/30";
      case "high":
      case "severe":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!diagnosis) {
    return (
      <MobileLayout showNav={false}>
        <div className="min-h-screen bg-background safe-area-top flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading diagnosis...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-background safe-area-top">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <h1 className="text-lg font-display font-semibold">Diagnosis Result</h1>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon-sm">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Image with Highlight */}
        <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden shadow-card">
          <div className="aspect-[4/3] bg-gradient-to-br from-muted to-secondary flex items-center justify-center relative">
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Captured crop" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Leaf className="w-32 h-32 text-primary/30" />
            )}
            
            {/* Affected Area Highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-1/3 left-1/3 w-24 h-24"
            >
              <div className="absolute inset-0 border-2 border-destructive rounded-full animate-pulse-ring" />
              <div className="absolute inset-2 border-2 border-dashed border-destructive/60 rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-1/4 right-1/4 w-16 h-16"
            >
              <div className="absolute inset-0 border-2 border-warning rounded-full animate-pulse-ring" />
            </motion.div>
          </div>

          {/* Confidence Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-semibold">{Math.round((diagnosis.confidence || 0) * 100)}% Match</span>
            </div>
          </motion.div>
        </div>

        {/* Disease Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 py-6"
        >
          {/* Analyzed Crop Display */}
          {diagnosis.analyzedCrop && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{diagnosis.analyzedCrop.name === 'Tomato' ? '🍅' : diagnosis.analyzedCrop.name === 'Wheat' ? '🌾' : diagnosis.analyzedCrop.name === 'Corn' ? '🌽' : diagnosis.analyzedCrop.name === 'Potato' ? '🥔' : diagnosis.analyzedCrop.name === 'Rice' ? '🌾' : diagnosis.analyzedCrop.name === 'Pepper' ? '🌶️' : '🌱'}</span>
                <span className="text-sm font-medium text-primary">Analyzed Crop: {diagnosis.analyzedCrop.name}</span>
              </div>
            </motion.div>
          )}

          {/* Disease Name & Severity */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  {diagnosis.name || diagnosis.disease || 'Disease Detected'}
                </h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Plant Disease • Confidence: {Math.round((diagnosis.confidence || 0) * 100)}%
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(
                diagnosis.severity
              )}`}
            >
              {diagnosis.severity || 'Unknown'}
            </span>
          </div>

          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-warning/10 border border-warning/30 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Immediate Action Required
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This disease spreads rapidly. Start treatment within 24-48 hours for best results.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">About this Disease</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {diagnosis.description}
            </p>
          </div>

          {/* Symptoms */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Identified Symptoms</h3>
            <div className="space-y-2">
              {(diagnosis.symptoms || ['Disease symptoms detected']).map((symptom, index) => (
                <motion.div
                  key={symptom}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl"
                >
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <span className="text-sm text-foreground">{symptom}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-8">
            <Button
              variant="gradient"
              size="xl"
              className="w-full"
              onClick={() => navigate("/treatment")}
            >
              View Treatment Options
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/voice")}
            >
              Ask AI Assistant
            </Button>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default Diagnosis;