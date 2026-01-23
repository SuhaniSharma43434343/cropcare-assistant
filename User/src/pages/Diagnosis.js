import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle, Share2, Bookmark, ChevronRight, Leaf, CheckCircle } from "lucide-react";
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

        {/* Image Preview and Disease Info */}
        <div className="px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Compact Image Preview */}
            <div className="lg:w-1/3">
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-muted to-secondary">
                <div className="aspect-square lg:aspect-[4/3] flex items-center justify-center relative">
                  {capturedImage ? (
                    <img 
                      src={capturedImage} 
                      alt="Captured crop" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Leaf className="w-16 h-16 text-primary/30" />
                  )}
                  
                  {/* Affected Area Highlights */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-1/3 left-1/3 w-12 h-12 lg:w-16 lg:h-16"
                  >
                    <div className="absolute inset-0 border-2 border-destructive rounded-full animate-pulse-ring" />
                    <div className="absolute inset-1 border-2 border-dashed border-destructive/60 rounded-full" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Disease Details */}
            <div className="lg:w-2/3 space-y-6">
              {/* Analyzed Crop Display */}
              {diagnosis.analyzedCrop && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-primary/10 border border-primary/20 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{diagnosis.analyzedCrop.name === 'Tomato' ? '🍅' : diagnosis.analyzedCrop.name === 'Wheat' ? '🌾' : diagnosis.analyzedCrop.name === 'Corn' ? '🌽' : diagnosis.analyzedCrop.name === 'Potato' ? '🥔' : diagnosis.analyzedCrop.name === 'Rice' ? '🌾' : diagnosis.analyzedCrop.name === 'Pepper' ? '🌶️' : '🌱'}</span>
                    <div>
                      <p className="text-sm font-medium text-primary">Analyzed Crop</p>
                      <p className="text-lg font-semibold text-foreground">{diagnosis.analyzedCrop.name}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Disease Name & Severity */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-2">
                      {diagnosis.name === 'No Disease Detected' || diagnosis.name === 'Healthy Plant' 
                        ? diagnosis.name 
                        : diagnosis.name || 'Disease Detected'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {diagnosis.name === 'No Disease Detected' || diagnosis.name === 'Healthy Plant' 
                          ? 'Plant Health Status' 
                          : 'Plant Disease'}
                      </span>
                      {diagnosis.model_version && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          AI Model {diagnosis.model_version}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap ${
                      diagnosis.name === 'No Disease Detected' || diagnosis.name === 'Healthy Plant'
                        ? 'bg-success/10 text-success border-success/30'
                        : getSeverityColor(diagnosis.severity)
                    }`}
                  >
                    {diagnosis.name === 'No Disease Detected' || diagnosis.name === 'Healthy Plant'
                      ? 'Healthy'
                      : `${diagnosis.severity || 'Unknown'} Severity`}
                  </span>
                </div>

                {/* Warning Banner - Only show for diseases */}
                {diagnosis.name !== 'No Disease Detected' && diagnosis.name !== 'Healthy Plant' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-warning/10 border border-warning/30 rounded-xl p-4"
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
                )}

                {/* Healthy Plant Banner */}
                {(diagnosis.name === 'No Disease Detected' || diagnosis.name === 'Healthy Plant') && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-success/10 border border-success/30 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Plant Appears Healthy
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          No disease symptoms detected. Continue regular care and monitoring.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">
                    {diagnosis.name === 'No Disease Detected' || diagnosis.name === 'Healthy Plant' 
                      ? 'Plant Health Assessment' 
                      : 'About this Disease'}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {diagnosis.description || 
                      (diagnosis.name === 'No Disease Detected' || diagnosis.name === 'Healthy Plant' 
                        ? 'Your plant appears to be in good health with no visible disease symptoms detected by our AI analysis.'
                        : 'Disease information not available. Please consult with an agricultural expert for proper identification.')}
                  </p>
                </div>

                {/* Symptoms */}
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">
                    {diagnosis.name === 'No Disease Detected' || diagnosis.name === 'Healthy Plant' 
                      ? 'Healthy Indicators' 
                      : 'Identified Symptoms'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(diagnosis.symptoms || 
                      (diagnosis.name === 'No Disease Detected' || diagnosis.name === 'Healthy Plant' 
                        ? ['No disease symptoms detected', 'Plant appears healthy', 'Normal growth patterns']
                        : ['Disease symptoms detected'])
                    ).map((symptom, index) => (
                      <motion.div
                        key={symptom}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          diagnosis.name === 'No Disease Detected' || diagnosis.name === 'Healthy Plant' 
                            ? 'bg-success' 
                            : 'bg-destructive'
                        }`} />
                        <span className="text-sm text-foreground">{symptom}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Action Buttons */}
          <div className="px-4 pb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              {diagnosis.name !== 'No Disease Detected' && diagnosis.name !== 'Healthy Plant' ? (
                <>
                  <Button
                    variant="gradient"
                    size="xl"
                    className="flex-1"
                    onClick={() => navigate("/treatment")}
                  >
                    View Treatment Options
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="sm:w-auto px-6"
                    onClick={() => navigate("/voice")}
                  >
                    Ask AI Assistant
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="gradient"
                    size="xl"
                    className="flex-1"
                    onClick={() => navigate("/")}
                  >
                    Back to Home
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="sm:w-auto px-6"
                    onClick={() => navigate("/capture")}
                  >
                    Scan Another Plant
                  </Button>
                </>
              )}
            </div>
          </div>
      </div>
    </MobileLayout>
  );
};

export default Diagnosis;