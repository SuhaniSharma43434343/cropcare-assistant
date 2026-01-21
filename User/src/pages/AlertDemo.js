import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Droplets,
  Cloud,
  Bug,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import MobileLayout from '../components/layout/MobileLayout';
import { useAlerts } from '../components/alerts/AlertProvider';
import AlertBell from '../components/alerts/AlertBell';
import AlertCenter from '../components/alerts/AlertCenter';
import { ALERT_TYPES, PRIORITY_LEVELS } from '../components/alerts/AlertSystem';

const AlertDemo = () => {
  const [showAlertCenter, setShowAlertCenter] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  
  const { 
    showTreatmentDue,
    showWeatherWarning,
    showDiseaseDetected,
    showSuccess,
    showError,
    showInfo,
    clearAllAlerts,
    addAlert
  } = useAlerts();

  const demoAlerts = [
    {
      title: 'Treatment Due',
      description: 'Neem oil spray for tomatoes',
      action: () => showTreatmentDue('Neem Oil Spray', 'Tomato Plants', '30 minutes'),
      icon: Droplets,
      color: 'bg-blue-500'
    },
    {
      title: 'Weather Warning',
      description: 'Heavy rain expected',
      action: () => showWeatherWarning('Heavy Rain', 'Rain expected in 2 hours. Consider postponing outdoor treatments.'),
      icon: Cloud,
      color: 'bg-orange-500'
    },
    {
      title: 'Disease Detected',
      description: 'Late blight identified',
      action: () => showDiseaseDetected('Late Blight', 92, 'Tomato Plants'),
      icon: Bug,
      color: 'bg-red-500'
    },
    {
      title: 'Success Message',
      description: 'Treatment applied successfully',
      action: () => showSuccess('Treatment has been applied successfully to your tomato plants.'),
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Error Alert',
      description: 'Connection failed',
      action: () => showError('Failed to sync data. Please check your internet connection.'),
      icon: AlertTriangle,
      color: 'bg-red-600'
    },
    {
      title: 'Information',
      description: 'New feature available',
      action: () => showInfo('New weather integration feature is now available in settings.'),
      icon: Info,
      color: 'bg-blue-600'
    }
  ];

  const runDemo = async () => {
    setDemoRunning(true);
    
    for (let i = 0; i < demoAlerts.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      demoAlerts[i].action();
    }
    
    setDemoRunning(false);
  };

  const createCustomAlert = () => {
    addAlert({
      type: ALERT_TYPES.INFO,
      title: 'Custom Alert',
      message: 'This is a custom alert with multiple actions and high priority.',
      priority: PRIORITY_LEVELS.HIGH,
      actions: [
        { label: 'Primary Action', type: 'primary', primary: true },
        { label: 'Secondary', type: 'secondary' },
        { label: 'Dismiss', type: 'dismiss' }
      ],
      autoDismiss: 10000
    });
  };

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-background safe-area-top">
        <div className="flex items-center justify-between px-4 py-4 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
          <h1 className="text-xl font-display font-bold text-gradient">Alert System Demo</h1>
          <AlertBell onClick={() => setShowAlertCenter(true)} />
        </div>

        <div className="px-4 py-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Demo Controls
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={runDemo}
                disabled={demoRunning}
                className="w-full"
                variant="gradient"
              >
                <Play className="w-4 h-4 mr-2" />
                {demoRunning ? 'Running Demo...' : 'Run Full Demo'}
              </Button>
              
              <Button
                onClick={clearAllAlerts}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All Alerts
              </Button>
              
              <Button
                onClick={createCustomAlert}
                variant="secondary"
                className="w-full sm:col-span-2"
              >
                <Bell className="w-4 h-4 mr-2" />
                Create Custom Alert
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Alert Types</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {demoAlerts.map((alert, index) => {
                const IconComponent = alert.icon;
                return (
                  <motion.div
                    key={alert.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={alert.action}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${alert.color} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Alert System Features</h2>
            
            <div className="space-y-4">
              {[
                {
                  title: 'Priority-Based Styling',
                  description: 'Different colors and animations based on alert priority (Low, Medium, High, Critical)'
                },
                {
                  title: 'Auto-Dismiss Timers',
                  description: 'Configurable auto-dismiss with visual progress indicators'
                },
                {
                  title: 'Action Buttons',
                  description: 'Interactive buttons for quick actions like Apply Now, Snooze, etc.'
                },
                {
                  title: 'Sound Notifications',
                  description: 'Audio alerts with different tones for different priority levels'
                },
                {
                  title: 'Responsive Design',
                  description: 'Optimized for mobile and desktop with proper touch targets'
                },
                {
                  title: 'Alert Center',
                  description: 'Centralized view with search, filtering, and management options'
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-info/10 border border-info/30 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4 text-info">How to Use</h2>
            
            <div className="space-y-3 text-sm">
              <p>• <strong>Click any alert type above</strong> to trigger that specific alert</p>
              <p>• <strong>Use the bell icon</strong> in the header to open the Alert Center</p>
              <p>• <strong>Run the full demo</strong> to see all alert types in sequence</p>
              <p>• <strong>Alerts auto-dismiss</strong> after a few seconds or can be manually closed</p>
              <p>• <strong>High priority alerts</strong> will shake the bell icon and play sounds</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      <AlertCenter 
        isOpen={showAlertCenter} 
        onClose={() => setShowAlertCenter(false)} 
      />
    </MobileLayout>
  );
};

export default AlertDemo;