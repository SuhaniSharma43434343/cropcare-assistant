import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { ALERT_TYPES, PRIORITY_LEVELS } from './AlertSystem';

const AlertContext = createContext();

const alertReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [...state.alerts, { ...action.payload, id: Date.now() + Math.random() }]
      };
    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload)
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        alerts: []
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    default:
      return state;
  }
};

const initialState = {
  alerts: [],
  settings: {
    soundEnabled: true,
    maxAlerts: 3,
    defaultAutoDismiss: 5000,
    enablePushNotifications: false
  }
};

export const AlertProvider = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  const addAlert = useCallback((alert) => {
    const newAlert = {
      timestamp: new Date().toISOString(),
      priority: PRIORITY_LEVELS.MEDIUM,
      autoDismiss: state.settings.defaultAutoDismiss,
      ...alert
    };
    
    dispatch({ type: 'ADD_ALERT', payload: newAlert });
    
    // Play sound if enabled
    if (state.settings.soundEnabled && alert.priority !== PRIORITY_LEVELS.LOW) {
      playNotificationSound(alert.priority);
    }
  }, [state.settings]);

  const removeAlert = useCallback((alertId) => {
    dispatch({ type: 'REMOVE_ALERT', payload: alertId });
  }, []);

  const clearAllAlerts = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const updateSettings = useCallback((newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  }, []);

  // Predefined alert creators
  const showTreatmentDue = useCallback((treatmentName, cropName, timeRemaining) => {
    addAlert({
      type: ALERT_TYPES.TREATMENT_DUE,
      title: 'Treatment Due',
      message: `${treatmentName} for ${cropName} is due in ${timeRemaining}`,
      priority: PRIORITY_LEVELS.HIGH,
      actions: [
        { label: 'Apply Now', type: 'apply_treatment', primary: true },
        { label: 'Snooze 1h', type: 'snooze_1h' },
        { label: 'Mark Done', type: 'mark_done' }
      ]
    });
  }, [addAlert]);

  const showWeatherWarning = useCallback((weatherType, message) => {
    addAlert({
      type: ALERT_TYPES.WEATHER_WARNING,
      title: `Weather Alert: ${weatherType}`,
      message,
      priority: PRIORITY_LEVELS.HIGH,
      actions: [
        { label: 'View Details', type: 'view_weather', primary: true },
        { label: 'Adjust Schedule', type: 'adjust_schedule' }
      ]
    });
  }, [addAlert]);

  const showDiseaseDetected = useCallback((diseaseName, confidence, cropName) => {
    addAlert({
      type: ALERT_TYPES.DISEASE_DETECTED,
      title: 'Disease Detected',
      message: `${diseaseName} detected in ${cropName} (${confidence}% confidence)`,
      priority: PRIORITY_LEVELS.CRITICAL,
      actions: [
        { label: 'View Treatment', type: 'view_treatment', primary: true },
        { label: 'Get Expert Help', type: 'expert_help' }
      ]
    });
  }, [addAlert]);

  const showSuccess = useCallback((message, title = 'Success') => {
    addAlert({
      type: ALERT_TYPES.SUCCESS,
      title,
      message,
      priority: PRIORITY_LEVELS.LOW,
      autoDismiss: 3000
    });
  }, [addAlert]);

  const showError = useCallback((message, title = 'Error') => {
    addAlert({
      type: ALERT_TYPES.ERROR,
      title,
      message,
      priority: PRIORITY_LEVELS.HIGH,
      autoDismiss: 8000
    });
  }, [addAlert]);

  const showInfo = useCallback((message, title = 'Information') => {
    addAlert({
      type: ALERT_TYPES.INFO,
      title,
      message,
      priority: PRIORITY_LEVELS.LOW,
      autoDismiss: 4000
    });
  }, [addAlert]);

  const playNotificationSound = (priority) => {
    if (!state.settings.soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different priorities
      const frequencies = {
        [PRIORITY_LEVELS.LOW]: 400,
        [PRIORITY_LEVELS.MEDIUM]: 600,
        [PRIORITY_LEVELS.HIGH]: 800,
        [PRIORITY_LEVELS.CRITICAL]: 1000
      };
      
      oscillator.frequency.setValueAtTime(frequencies[priority] || 600, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  const value = {
    alerts: state.alerts,
    settings: state.settings,
    addAlert,
    removeAlert,
    clearAllAlerts,
    updateSettings,
    // Convenience methods
    showTreatmentDue,
    showWeatherWarning,
    showDiseaseDetected,
    showSuccess,
    showError,
    showInfo
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};