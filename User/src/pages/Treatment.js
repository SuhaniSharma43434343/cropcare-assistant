import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Leaf, 
  FlaskConical, 
  AlertTriangle, 
  Cloud, 
  Sun, 
  Droplets,
  Clock,
  Shield,
  CheckCircle,
  Sparkles,
  Bell,
  Loader2,
  Calendar,
  List
} from "lucide-react";
import { Button } from "../components/ui/button";
import MobileLayout from "../components/layout/MobileLayout";
import { useAlerts } from "../components/alerts/AlertProvider";
import AlertBell from "../components/alerts/AlertBell";
import AlertCenter from "../components/alerts/AlertCenter";
import ReminderModal from "../components/reminders/ReminderModal";
import ReminderList from "../components/reminders/ReminderList";
import ReminderAlert from "../components/reminders/ReminderAlert";
import WeatherRecommendation from "../components/WeatherRecommendation";
import reminderService from "../services/reminderService";
import { ALERT_TYPES, PRIORITY_LEVELS } from "../components/alerts/AlertSystem";

const Treatment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("organic");
  const [showAlertCenter, setShowAlertCenter] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showReminderList, setShowReminderList] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { 
    showTreatmentDue, 
    showWeatherWarning, 
    showSuccess, 
    showError,
    showInfo 
  } = useAlerts();

  useEffect(() => {
    const loadTreatmentData = async () => {
      try {
        // Get diagnosis result from session storage (from ML service only)
        const diagnosisResult = sessionStorage.getItem('diagnosisResult');
        
        if (!diagnosisResult) {
          showError('No diagnosis found. Please scan an image first.');
          navigate('/capture');
          return;
        }

        const parsedDiagnosis = JSON.parse(diagnosisResult);
        
        // Validate that this is from ML service
        if (!parsedDiagnosis.treatment || !parsedDiagnosis.name) {
          showError('Invalid diagnosis data. Please scan an image again.');
          navigate('/capture');
          return;
        }

        setDiagnosisData(parsedDiagnosis);
        setLoading(false);
      } catch (error) {
        console.error('Error loading treatment data:', error);
        showError('Failed to load treatment data.');
        navigate('/diagnosis');
      }
    };

    loadTreatmentData();
  }, [navigate, showError]);

  const handleSetReminder = (treatment) => {
    setSelectedTreatment(treatment);
    setShowReminderModal(true);
  };

  // Get current treatments from ML service data only
  const getCurrentTreatments = () => {
    if (!diagnosisData?.treatment) return [];
    return diagnosisData.treatment[activeTab] || [];
  };

  const treatments = getCurrentTreatments();

  if (loading) {
    return (
      <MobileLayout showNav={false}>
        <div className="min-h-screen bg-background safe-area-top flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading AI treatment recommendations...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!diagnosisData) {
    return (
      <MobileLayout showNav={false}>
        <div className="min-h-screen bg-background safe-area-top flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">No AI Diagnosis Found</p>
            <p className="text-muted-foreground mb-4">Please scan an image first to get AI-powered treatment recommendations.</p>
            <Button onClick={() => navigate('/capture')}>Scan Image</Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const safetyTips = [
    "Always wear gloves and mask when spraying",
    "Spray early morning or late evening",
    "Avoid spraying on windy days",
    "Keep children and pets away during application",
  ];

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-background safe-area-top">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <h1 className="text-lg font-display font-semibold">Treatment Plan</h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowReminderList(true)}
              className="relative"
            >
              <List className="w-5 h-5" />
            </Button>
            <AlertBell onClick={() => setShowAlertCenter(true)} />
          </div>
        </div>

        <div className="px-4 py-4 max-w-6xl mx-auto">
          {/* Disease Reference */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 glass-card rounded-2xl mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground text-lg">{diagnosisData.name || 'Disease Detected'}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  Confidence: {Math.round((diagnosisData.confidence || 0) * 100)}%
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  Severity: {diagnosisData.severity || 'Unknown'}
                </span>
                {diagnosisData.analyzed_crop && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      Crop: {diagnosisData.analyzed_crop}
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Treatment Type Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "organic" ? "gradient" : "secondary"}
              className="flex-1 sm:flex-none sm:px-8"
              onClick={() => setActiveTab("organic")}
            >
              <Leaf className="w-4 h-4 mr-2" />
              Organic
            </Button>
            <Button
              variant={activeTab === "chemical" ? "gradient" : "secondary"}
              className="flex-1 sm:flex-none sm:px-8"
              onClick={() => setActiveTab("chemical")}
            >
              <FlaskConical className="w-4 h-4 mr-2" />
              Chemical
            </Button>
          </div>

          {/* AI Weather Recommendation */}
          <WeatherRecommendation />

          {/* Treatment Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
            >
              {treatments.map((treatment, index) => {
                const IconComponent = treatment.icon || Leaf;
                return (
                  <motion.div
                    key={treatment.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-4 shadow-card h-full"
                  >
                    <div className="flex items-start gap-4 h-full">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        activeTab === "organic" ? "bg-success/10" : "bg-warning/10"
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          activeTab === "organic" ? "text-success" : "text-warning"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-3 text-lg">{treatment.name}</h3>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Droplets className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Dosage: {treatment.dosage}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Apply {treatment.frequency}</span>
                          </div>
                          {treatment.instructions && (
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span className="text-xs leading-relaxed">{treatment.instructions}</span>
                            </div>
                          )}
                        </div>

                        {/* Effectiveness Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-muted-foreground">Effectiveness</span>
                            <span className="text-foreground font-medium">{treatment.effectiveness}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${treatment.effectiveness}%` }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                              className={`h-full rounded-full ${
                                activeTab === "organic" ? "bg-success" : "bg-warning"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Set Reminder Button */}
                        <div className="mt-4">
                          <Button
                            onClick={() => handleSetReminder(treatment)}
                            variant="outline"
                            size="sm"
                            className="w-full text-primary border-primary hover:bg-primary/10"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Set Reminder
                          </Button>
                        </div>

                        {/* Warning for chemical */}
                        {treatment.warning && (
                          <div className="mt-3 flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-destructive leading-relaxed">{treatment.warning}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Safety Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-warning/5 border border-warning/20 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-foreground">Safety Guidelines</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-safe">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setShowReminderList(true)}
            >
              <Bell className="w-4 h-4 mr-2" />
              View Active Reminders
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={() => {
                showInfo('Set reminders for individual treatments using the "Set Reminder" button on each treatment card.');
              }}
            >
              <List className="w-4 h-4 mr-2" />
              How to Set Reminders
            </Button>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <AlertCenter 
        isOpen={showAlertCenter} 
        onClose={() => setShowAlertCenter(false)} 
      />
      
      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        treatment={selectedTreatment}
        diseaseInfo={diagnosisData}
      />
      
      <ReminderList
        isOpen={showReminderList}
        onClose={() => setShowReminderList(false)}
      />
      
      {/* Global Reminder Alert */}
      <ReminderAlert />
    </MobileLayout>
  );
};

export default Treatment;