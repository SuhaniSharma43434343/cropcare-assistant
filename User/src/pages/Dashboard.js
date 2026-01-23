import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Calendar, 
  Bell, 
  Leaf, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import MobileLayout from "../components/layout/MobileLayout";
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";
import AlertBell from "../components/alerts/AlertBell";
import AlertCenter from "../components/alerts/AlertCenter";
import { useAlerts } from "../components/alerts/AlertProvider";
import { useDisease } from "../contexts/DiseaseContext";
import apiService from "../services/apiService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAlertCenter, setShowAlertCenter] = useState(false);
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
  const recentDiagnoses = recentDetections.slice(0, 3).map((detection, index) => ({
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

  // Generate reminders from latest detection treatment
  const reminders = latestDetection?.treatment ? [
    {
      id: 1,
      text: `Apply ${latestDetection.treatment.organic?.[0]?.name || 'Treatment'} to ${latestDetection.crop.toLowerCase()} plants`,
      time: "Today, 6:00 PM",
      treatment: latestDetection.treatment.organic?.[0]
    },
    {
      id: 2,
      text: `Monitor ${latestDetection.crop.toLowerCase()} for ${latestDetection.name.toLowerCase()} symptoms`,
      time: "Tomorrow, 7:00 AM"
    }
  ] : [
    { id: 1, text: "No active treatments", time: "Scan crops to get started" }
  ];

  return (
    <MobileLayout>
      <div className="px-4 pt-6 safe-area-top">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Track your crop health</p>
          </div>
          <AlertBell onClick={() => setShowAlertCenter(true)} />
        </motion.div>

        {/* Latest Detection Alert */}
        {latestDetection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                    Latest Detection: {latestDetection.name}
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                    Found in {latestDetection.crop} • {latestDetection.severity} severity
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // Set the latest detection as current diagnosis
                        sessionStorage.setItem('diagnosisResult', JSON.stringify({
                          ...latestDetection,
                          analyzedCrop: { name: latestDetection.crop }
                        }));
                        navigate('/diagnosis');
                      }}
                      className="text-xs border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => navigate('/treatment')}
                      className="text-xs bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Get Treatment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-3 mb-6"
        >
          <div className="glass-card rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Disease Detections</span>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalDetections}
            </p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
        </motion.div>



        {/* Disease Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 shadow-card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Disease Breakdown</h2>
            <span className="text-xs text-muted-foreground">This month</span>
          </div>
          <div className="h-32">
            {!hasDetections ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Leaf className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground">No disease detections yet</div>
                  <div className="text-xs text-muted-foreground mt-1">Scan your crops to get started</div>
                </div>
              </div>
            ) : diseaseData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-muted-foreground">No disease detections this month</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Recent Diagnoses */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Diagnoses</h2>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentDiagnoses.length === 0 ? (
              <div className="text-center py-8">
                <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">No recent diagnoses</p>
                <Button 
                  size="sm" 
                  onClick={() => navigate("/capture")}
                  className="text-xs"
                >
                  Start Scanning
                </Button>
              </div>
            ) : (
              recentDiagnoses.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 glass-card rounded-2xl shadow-soft cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate("/diagnosis")}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.status === "healthy" ? "bg-success/10" : "bg-warning/10"
                  }`}>
                    {item.status === "healthy" ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Clock className="w-5 h-5 text-warning" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{item.crop}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{item.disease}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.severity === "Mild" || item.severity === "Low"
                      ? "bg-success/10 text-success"
                      : item.severity === "Moderate" || item.severity === "Medium"
                      ? "bg-warning/10 text-warning"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {item.severity}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Spray Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Spray Reminders</h2>
            <Button variant="ghost" size="sm" className="text-xs">
              Add New
            </Button>
          </div>
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => {
                  if (reminder.treatment) {
                    showTreatmentDue(
                      reminder.treatment.name || 'Treatment',
                      latestDetection?.crop || 'Plants',
                      '2 hours'
                    );
                  }
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{reminder.text}</p>
                  <p className="text-xs text-muted-foreground">{reminder.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <AlertCenter 
        isOpen={showAlertCenter} 
        onClose={() => setShowAlertCenter(false)} 
      />
    </MobileLayout>
  );
};

export default Dashboard;