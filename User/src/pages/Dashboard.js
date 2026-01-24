import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Leaf,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from "lucide-react";
import { Button } from "../components/ui/button";
import SidebarLayout from "../components/layout/SidebarLayout";
import FarmAnalytics from "../components/FarmAnalytics";
import { useAlerts } from "../components/alerts/AlertProvider";
import { useDisease } from "../contexts/DiseaseContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showTreatmentDue, showSuccess } = useAlerts();
  const { recentDetections, getDetectionsByDisease, hasDetections, latestDetection } = useDisease();

  // Get disease breakdown data from context
  const diseaseData = getDetectionsByDisease();
  const totalDetections = recentDetections.length;

  // Listen for new disease detections
  useEffect(() => {
    const handleNewDetection = (event) => {
      const detection = event.detail;
      showSuccess(`New ${detection.severity.toLowerCase()} severity ${detection.name} detected in ${detection.crop}!`);
    };

    window.addEventListener('diseaseDetected', handleNewDetection);
    return () => window.removeEventListener('diseaseDetected', handleNewDetection);
  }, [showSuccess]);

  // Generate recent diagnoses from context data
  const recentDiagnoses = recentDetections.slice(0, 5).map((detection, index) => ({
    id: detection.id,
    crop: detection.crop,
    disease: detection.name,
    severity: detection.severity,
    date: new Date(detection.date).toLocaleDateString() === new Date().toLocaleDateString() 
      ? 'Today' 
      : new Date(detection.date).toLocaleDateString() === new Date(Date.now() - 86400000).toLocaleDateString()
      ? 'Yesterday'
      : new Date(detection.date).toLocaleDateString(),
    status: detection.status === 'detected' ? 'treating' : 'healthy',
  }));

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farm Dashboard</h1>
          <p className="text-gray-600">Monitor your crops, track diseases, and optimize your farming with AI-powered insights.</p>
        </motion.div>

        {/* Latest Detection Alert - Red Indicator */}
        {latestDetection ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <h3 className="font-semibold text-red-900 text-lg">
                      Latest Detection Alert
                    </h3>
                  </div>
                  <h4 className="font-medium text-red-800 mb-2">
                    {latestDetection.name} detected in {latestDetection.crop}
                  </h4>
                  <p className="text-red-700 mb-4">
                    Severity: {latestDetection.severity} • Detected: {new Date(latestDetection.date).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        sessionStorage.setItem('diagnosisResult', JSON.stringify({
                          ...latestDetection,
                          analyzedCrop: { name: latestDetection.crop }
                        }));
                        navigate('/diagnosis');
                      }}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      View Details
                    </Button>
                    <Button 
                      onClick={() => navigate('/treatment')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Get Treatment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 text-lg mb-1">All Clear</h3>
                  <p className="text-green-700">No recent disease detections. Your crops are healthy!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Farm Analytics Section - Middle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Farm Analytics</h3>
            <FarmAnalytics totalDetections={totalDetections} diseaseData={diseaseData} />
          </div>
        </motion.div>

        {/* Recent Activity Section - Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              View All
            </Button>
          </div>
          
          {recentDiagnoses.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No recent activity</p>
              <Button onClick={() => navigate('/capture')} className="bg-green-600 hover:bg-green-700">
                Start Scanning Crops
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDiagnoses.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                  onClick={() => navigate('/diagnosis')}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    item.status === "healthy" ? "bg-green-100 group-hover:bg-green-200" : "bg-orange-100 group-hover:bg-orange-200"
                  }`}>
                    {item.status === "healthy" ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{item.crop}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{item.disease}</span>
                    </div>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.severity === "Mild" || item.severity === "Low"
                      ? "bg-green-100 text-green-700"
                      : item.severity === "Moderate" || item.severity === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {item.severity}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;