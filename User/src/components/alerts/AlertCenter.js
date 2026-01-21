import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Settings, 
  Trash2, 
  Filter,
  Search,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAlerts } from './AlertProvider';
import { ALERT_TYPES, PRIORITY_LEVELS } from './AlertSystem';
import { cn } from '../../lib/utils';

const AlertCenter = ({ isOpen, onClose }) => {
  const { alerts, removeAlert, clearAllAlerts, settings, updateSettings } = useAlerts();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.type === filter || alert.priority === filter;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getAlertIcon = (type) => {
    const icons = {
      [ALERT_TYPES.SUCCESS]: CheckCircle,
      [ALERT_TYPES.ERROR]: AlertTriangle,
      [ALERT_TYPES.WARNING]: AlertTriangle,
      [ALERT_TYPES.INFO]: Info,
      [ALERT_TYPES.TREATMENT_DUE]: Clock,
      [ALERT_TYPES.WEATHER_WARNING]: AlertTriangle,
      [ALERT_TYPES.DISEASE_DETECTED]: AlertTriangle
    };
    return icons[type] || Info;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      [PRIORITY_LEVELS.LOW]: 'text-gray-500',
      [PRIORITY_LEVELS.MEDIUM]: 'text-blue-500',
      [PRIORITY_LEVELS.HIGH]: 'text-orange-500',
      [PRIORITY_LEVELS.CRITICAL]: 'text-red-500'
    };
    return colors[priority] || 'text-gray-500';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Alert Center</h2>
              {alerts.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {alerts.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b bg-muted/30 overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sound Notifications</span>
                    <Button
                      size="sm"
                      variant={settings.soundEnabled ? "default" : "outline"}
                      onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                    >
                      {settings.soundEnabled ? 'On' : 'Off'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto Dismiss (seconds)</span>
                    <select
                      value={settings.defaultAutoDismiss / 1000}
                      onChange={(e) => updateSettings({ defaultAutoDismiss: parseInt(e.target.value) * 1000 })}
                      className="px-2 py-1 text-sm border rounded"
                    >
                      <option value={3}>3s</option>
                      <option value={5}>5s</option>
                      <option value={10}>10s</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search and Filter */}
          <div className="p-4 space-y-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { value: 'all', label: 'All' },
                { value: PRIORITY_LEVELS.CRITICAL, label: 'Critical' },
                { value: PRIORITY_LEVELS.HIGH, label: 'High' },
                { value: ALERT_TYPES.TREATMENT_DUE, label: 'Treatments' },
                { value: ALERT_TYPES.WEATHER_WARNING, label: 'Weather' }
              ].map((filterOption) => (
                <Button
                  key={filterOption.value}
                  size="sm"
                  variant={filter === filterOption.value ? "default" : "outline"}
                  onClick={() => setFilter(filterOption.value)}
                  className="whitespace-nowrap"
                >
                  {filterOption.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto">
            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No alerts</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filter !== 'all' 
                    ? 'No alerts match your current filter'
                    : 'All caught up! No new alerts to show.'
                  }
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <AnimatePresence>
                  {filteredAlerts.map((alert) => {
                    const IconComponent = getAlertIcon(alert.type);
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                            getPriorityColor(alert.priority)
                          )}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium text-foreground truncate">
                                {alert.title}
                              </h4>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => removeAlert(alert.id)}
                                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {alert.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatDate(alert.timestamp)}
                              </span>
                              <span className={cn(
                                'text-xs px-2 py-1 rounded-full',
                                getPriorityColor(alert.priority)
                              )}>
                                {alert.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {alerts.length > 0 && (
            <div className="p-4 border-t bg-muted/30">
              <Button
                variant="outline"
                onClick={clearAllAlerts}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Alerts
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlertCenter;