import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  Clock,
  Droplets,
  Leaf,
  Calendar,
  Settings
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

// Alert Types
const ALERT_TYPES = {
  TREATMENT_DUE: 'treatment_due',
  WEATHER_WARNING: 'weather_warning',
  DISEASE_DETECTED: 'disease_detected',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error'
};

// Alert Priority Levels
const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

const AlertSystem = ({ alerts = [], onDismiss, onAction, className }) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    setVisibleAlerts(alerts.slice(0, 3)); // Show max 3 alerts at once
  }, [alerts]);

  const getAlertConfig = (type) => {
    const configs = {
      [ALERT_TYPES.TREATMENT_DUE]: {
        icon: Droplets,
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30'
      },
      [ALERT_TYPES.WEATHER_WARNING]: {
        icon: AlertTriangle,
        bgColor: 'bg-orange-50 dark:bg-orange-950/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
        iconColor: 'text-orange-600 dark:text-orange-400',
        iconBg: 'bg-orange-100 dark:bg-orange-900/30'
      },
      [ALERT_TYPES.DISEASE_DETECTED]: {
        icon: AlertTriangle,
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-200 dark:border-red-800',
        iconColor: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-100 dark:bg-red-900/30'
      },
      [ALERT_TYPES.SUCCESS]: {
        icon: CheckCircle,
        bgColor: 'bg-green-50 dark:bg-green-950/20',
        borderColor: 'border-green-200 dark:border-green-800',
        iconColor: 'text-green-600 dark:text-green-400',
        iconBg: 'bg-green-100 dark:bg-green-900/30'
      },
      [ALERT_TYPES.INFO]: {
        icon: Info,
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30'
      },
      [ALERT_TYPES.WARNING]: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/30'
      },
      [ALERT_TYPES.ERROR]: {
        icon: X,
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-200 dark:border-red-800',
        iconColor: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-100 dark:bg-red-900/30'
      }
    };

    return configs[type] || configs[ALERT_TYPES.INFO];
  };

  const getPriorityStyles = (priority) => {
    const styles = {
      [PRIORITY_LEVELS.LOW]: 'ring-1 ring-gray-200',
      [PRIORITY_LEVELS.MEDIUM]: 'ring-2 ring-blue-300',
      [PRIORITY_LEVELS.HIGH]: 'ring-2 ring-orange-400 shadow-lg',
      [PRIORITY_LEVELS.CRITICAL]: 'ring-3 ring-red-500 shadow-xl animate-pulse-ring'
    };
    return styles[priority] || styles[PRIORITY_LEVELS.LOW];
  };

  const handleDismiss = (alertId) => {
    setVisibleAlerts(prev => prev.filter(alert => alert.id !== alertId));
    onDismiss?.(alertId);
  };

  const handleAction = (alert, actionType) => {
    onAction?.(alert, actionType);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={cn('fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full sm:max-w-xs', className)}>
      <AnimatePresence mode="popLayout">
        {visibleAlerts.map((alert) => {
          const config = getAlertConfig(alert.type);
          const IconComponent = config.icon;
          const priorityStyles = getPriorityStyles(alert.priority);

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3 
              }}
              className={cn(
                'relative overflow-hidden rounded-2xl border backdrop-blur-md shadow-lg',
                config.bgColor,
                config.borderColor,
                priorityStyles,
                'p-4 pr-12'
              )}
            >
              {alert.priority === PRIORITY_LEVELS.CRITICAL && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              )}
              
              <div className="flex items-start gap-3">
                <div className={cn('flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center', config.iconBg)}>
                  <IconComponent className={cn('w-5 h-5', config.iconColor)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {alert.title}
                    </h4>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatTimeAgo(alert.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {alert.message}
                  </p>

                  {alert.actions && alert.actions.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {alert.actions.map((action, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant={action.primary ? "default" : "outline"}
                          onClick={() => handleAction(alert, action.type)}
                          className="text-xs h-7 px-3"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => handleDismiss(alert.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-black/10"
              >
                <X className="w-3 h-3" />
              </Button>

              {alert.autoDismiss && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: alert.autoDismiss / 1000, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30"
                  onAnimationComplete={() => handleDismiss(alert.id)}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AlertSystem;
export { ALERT_TYPES, PRIORITY_LEVELS };