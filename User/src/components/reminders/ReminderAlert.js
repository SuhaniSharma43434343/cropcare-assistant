import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Clock, 
  CheckCircle, 
  Snooze,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';
import reminderService from '../../services/reminderService';

const ReminderAlert = () => {
  const [activeReminder, setActiveReminder] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleReminder = (event) => {
      setActiveReminder(event.detail);
      setIsVisible(true);
    };

    window.addEventListener('treatmentReminder', handleReminder);
    return () => window.removeEventListener('treatmentReminder', handleReminder);
  }, []);

  const handleComplete = () => {
    if (activeReminder) {
      reminderService.completeReminder(activeReminder.id);
      setIsVisible(false);
      setActiveReminder(null);
    }
  };

  const handleSnooze = (minutes) => {
    if (activeReminder) {
      reminderService.snoozeReminder(activeReminder.id, minutes);
      setIsVisible(false);
      setActiveReminder(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setActiveReminder(null);
  };

  if (!isVisible || !activeReminder) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-4 left-4 right-4 z-[100] max-w-md mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-orange-200 dark:border-orange-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Treatment Reminder</h3>
                  <p className="text-sm opacity-90">Time to apply treatment</p>
                </div>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  Apply {activeReminder.treatmentName}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  For {activeReminder.diseaseName}
                </p>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Dosage:</span> {activeReminder.dosage}</p>
                  {activeReminder.instructions && (
                    <p><span className="font-medium">Instructions:</span> {activeReminder.instructions}</p>
                  )}
                </div>
              </div>
            </div>

            {activeReminder.warning && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <span className="font-medium">Warning:</span> {activeReminder.warning}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleComplete}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Applied
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSnooze(15)}
                  className="text-sm"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  15 min
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSnooze(60)}
                  className="text-sm"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  1 hour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReminderAlert;