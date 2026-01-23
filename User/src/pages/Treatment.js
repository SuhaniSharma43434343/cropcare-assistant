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
        <div className="min-h-screen bg-white safe-area-top flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading AI treatment recommendations...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!diagnosisData) {
    return (
      <MobileLayout showNav={false}>
        <div className="min-h-screen bg-white safe-area-top flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <p className="text-gray-900 font-semibold text-xl mb-3">No AI Diagnosis Found</p>
            <p className="text-gray-600 mb-6 leading-relaxed">Please scan an image first to get AI-powered treatment recommendations.</p>
            <Button onClick={() => navigate('/capture')} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium">
              Scan Image
            </Button>
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
      <div className="min-h-screen bg-white safe-area-top">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100 rounded-xl"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </Button>
            
            <h1 className="text-xl font-bold text-gray-900">Treatment Plan</h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowReminderList(true)}
                className="hover:bg-gray-100 rounded-xl"
              >
                <List className="w-5 h-5 text-gray-700" />
              </Button>
              <AlertBell onClick={() => setShowAlertCenter(true)} />
            </div>
          </div>
        </div>

        <div className="px-4 py-6 max-w-6xl mx-auto space-y-6">
          {/* Disease Reference */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-7 h-7 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 text-xl mb-2">{diagnosisData.name || 'Disease Detected'}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-semibold text-green-600">{Math.round((diagnosisData.confidence || 0) * 100)}%</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">Severity:</span>
                    <span className="font-semibold text-orange-600">{diagnosisData.severity || 'Unknown'}</span>
                  </div>
                  {diagnosisData.analyzed_crop && (
                    <>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Crop:</span>
                        <span className="font-semibold text-blue-600">{diagnosisData.analyzed_crop}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Treatment Type Tabs */}
          <div className="flex gap-3 p-1 bg-gray-100 rounded-2xl">
            <Button
              variant={activeTab === "organic" ? "default" : "ghost"}
              className={`flex-1 sm:flex-none sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "organic" 
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white"
              }`}
              onClick={() => setActiveTab("organic")}
            >
              <Leaf className="w-4 h-4 mr-2" />
              Organic
            </Button>
            <Button
              variant={activeTab === "chemical" ? "default" : "ghost"}
              className={`flex-1 sm:flex-none sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "chemical" 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white"
              }`}
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
              className="grid grid-cols-1 xl:grid-cols-2 gap-4"
            >
              {treatments.map((treatment, index) => {
                const IconComponent = treatment.icon || Leaf;
                return (
                  <motion.div
                    key={treatment.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
                  >
                    <div className="flex items-start gap-4 h-full">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        activeTab === "organic" ? "bg-green-100" : "bg-blue-100"
                      }`}>
                        <IconComponent className={`w-7 h-7 ${
                          activeTab === "organic" ? "text-green-600" : "text-blue-600"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-4 text-lg leading-tight">{treatment.name}</h3>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Droplets className="w-4 h-4 flex-shrink-0 text-blue-500" />
                            <span className="font-medium">Dosage: <span className="text-gray-900">{treatment.dosage}</span></span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <Clock className="w-4 h-4 flex-shrink-0 text-orange-500" />
                            <span className="font-medium">Apply <span className="text-gray-900">{treatment.frequency}</span></span>
                          </div>
                          {treatment.instructions && (
                            <div className="flex items-start gap-3 text-gray-600">
                              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                              <span className="text-sm leading-relaxed">{treatment.instructions}</span>
                            </div>
                          )}
                        </div>

                        {/* Effectiveness Bar */}
                        <div className="mt-6">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 font-medium">Effectiveness</span>
                            <span className="text-gray-900 font-bold">{treatment.effectiveness}%</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${treatment.effectiveness}%` }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                              className={`h-full rounded-full ${
                                activeTab === "organic" ? "bg-green-500" : "bg-blue-500"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Set Reminder Button */}
                        <div className="mt-6">
                          <Button
                            onClick={() => handleSetReminder(treatment)}
                            variant="outline"
                            size="sm"
                            className="w-full border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 font-semibold py-3 rounded-xl transition-all duration-200"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Set Reminder
                          </Button>
                        </div>

                        {/* Warning for chemical */}
                        {treatment.warning && (
                          <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-red-700 leading-relaxed font-medium">{treatment.warning}</span>
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
            className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Safety Guidelines</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="pb-safe pt-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200" 
              size="lg"
              onClick={() => setShowReminderList(true)}
            >
              <Bell className="w-5 h-5 mr-3" />
              View Active Reminders
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