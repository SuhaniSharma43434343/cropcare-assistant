import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  AlertTriangle, 
  AlertCircle, 
  Stethoscope, 
  Cloud,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useDisease } from '../../contexts/DiseaseContext';
import { useAlerts } from './AlertProvider';

const AlertCenter = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('treatment');
  const { recentDetections } = useDisease();
  const { alerts } = useAlerts();

  // Mock weather alerts for demonstration
  const [weatherAlerts, setWeatherAlerts] = useState([]);

  useEffect(() => {
    // Simulate weather alerts
    const mockWeatherAlerts = [
      {
        id: 'weather-1',
        type: 'Heavy Rain Warning',
        message: 'Heavy rainfall expected in your area. Protect crops from waterlogging.',
        severity: 'high',
        date: new Date().toISOString(),
        location: 'Your Area'
      },
      {
        id: 'weather-2',
        type: 'Temperature Alert',
        message: 'Extreme heat conditions may affect crop growth.',
        severity: 'medium',
        date: new Date(Date.now() - 86400000).toISOString(),
        location: 'Regional'
      }
    ];
    setWeatherAlerts(mockWeatherAlerts);
  }, []);

  // Filter alerts by category
  const criticalAlerts = alerts.filter(alert => alert.priority === 'critical');
  const highAlerts = alerts.filter(alert => alert.priority === 'high');
  
  // Convert disease detections to treatment alerts
  const treatmentAlerts = recentDetections.map(detection => ({
    id: `treatment-${detection.id}`,
    diseaseName: detection.name,
    crop: detection.crop,
    treatmentMethod: detection.treatment?.organic?.[0]?.name || detection.treatment?.chemical?.[0]?.name || 'Treatment Available',
    date: detection.date,
    status: detection.status || 'pending',
    severity: detection.severity,
    confidence: detection.confidence,
    details: detection.treatment
  }));

  const tabs = [
    { 
      id: 'critical', 
      label: 'Critical', 
      icon: AlertTriangle, 
      count: criticalAlerts.length,
      color: 'text-red-500'
    },
    { 
      id: 'high', 
      label: 'High', 
      icon: AlertCircle, 
      count: highAlerts.length,
      color: 'text-orange-500'
    },
    { 
      id: 'treatment', 
      label: 'Treatment', 
      icon: Stethoscope, 
      count: treatmentAlerts.length,
      color: 'text-emerald-500'
    },
    { 
      id: 'weather', 
      label: 'Weather', 
      icon: Cloud, 
      count: weatherAlerts.length,
      color: 'text-blue-500'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-50';
      case 'high': return 'text-orange-500 bg-orange-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  const renderTreatmentAlerts = () => {
    if (treatmentAlerts.length === 0) {
      return (
        <div className="text-center py-12">
          <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Treatment Alerts</h3>
          <p className="text-gray-500">Treatment alerts will appear here after crop scans.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {treatmentAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {getStatusIcon(alert.status)}
                  <h4 className="font-semibold text-gray-900">{alert.diseaseName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Crop:</span> {alert.crop}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Treatment:</span> {alert.treatmentMethod}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(alert.date)}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(alert.confidence * 100)}% confidence
                </div>
              </div>
            </div>
            
            {alert.details && (
              <div className="border-t border-gray-100 pt-3">
                <button className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 transition-colors">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Treatment Details
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderWeatherAlerts = () => {
    if (weatherAlerts.length === 0) {
      return (
        <div className="text-center py-12">
          <Cloud className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Weather Alerts</h3>
          <p className="text-gray-500">Weather alerts will appear here when conditions may affect your crops.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {weatherAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Cloud className="w-4 h-4 text-blue-500" />
                  <h4 className="font-semibold text-gray-900">{alert.type}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {alert.location}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(alert.date)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderGenericAlerts = (alertList, emptyIcon, emptyTitle, emptyMessage) => {
    if (alertList.length === 0) {
      const EmptyIcon = emptyIcon;
      return (
        <div className="text-center py-12">
          <EmptyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyTitle}</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {alertList.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{alert.title}</h4>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(alert.timestamp)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'critical':
        return renderGenericAlerts(
          criticalAlerts, 
          AlertTriangle, 
          'No Critical Alerts', 
          'Critical alerts will appear here when immediate attention is required.'
        );
      case 'high':
        return renderGenericAlerts(
          highAlerts, 
          AlertCircle, 
          'No High Priority Alerts', 
          'High priority alerts will appear here when important issues need attention.'
        );
      case 'treatment':
        return renderTreatmentAlerts();
      case 'weather':
        return renderWeatherAlerts();
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Alert Center Panel */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-50 z-50 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Alert Center</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 px-4">
              <div className="flex space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative flex items-center space-x-2 px-3 py-3 text-sm font-medium transition-colors
                        ${isActive 
                          ? 'text-gray-900 border-b-2 border-emerald-500' 
                          : 'text-gray-500 hover:text-gray-700'
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? tab.color : ''}`} />
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`
                          px-1.5 py-0.5 text-xs rounded-full font-medium
                          ${isActive 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertCenter;