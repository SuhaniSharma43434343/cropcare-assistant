import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Clock, 
  Trash2, 
  CheckCircle,
  Calendar,
  Leaf,
  AlertCircle,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import reminderService from '../../services/reminderService';
import { useAlerts } from '../alerts/AlertProvider';

const ReminderList = ({ isOpen, onClose }) => {
  const [reminders, setReminders] = useState([]);
  const { showSuccess } = useAlerts();

  useEffect(() => {
    if (isOpen) {
      loadReminders();
    }
  }, [isOpen]);

  const loadReminders = () => {
    const activeReminders = reminderService.getActiveReminders();
    setReminders(activeReminders);
  };

  const handleDelete = (id) => {
    reminderService.deleteReminder(id);
    loadReminders();
    showSuccess('Reminder deleted successfully');
  };

  const handleComplete = (id) => {
    reminderService.completeReminder(id);
    loadReminders();
    showSuccess('Treatment marked as completed');
  };

  const formatTimeUntil = (dueTime) => {
    const now = new Date();
    const due = new Date(dueTime);
    const diff = due.getTime() - now.getTime();
    
    if (diff < 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getStatusColor = (dueTime) => {
    const now = new Date();
    const due = new Date(dueTime);
    const diff = due.getTime() - now.getTime();
    
    if (diff < 0) return 'text-red-600 bg-red-50';
    if (diff < 60 * 60 * 1000) return 'text-orange-600 bg-orange-50'; // < 1 hour
    return 'text-green-600 bg-green-50';
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Active Reminders</h2>
              <p className="text-sm text-muted-foreground">{reminders.length} active treatment reminders</p>
            </div>
          </div>
          <Button size="icon-sm" variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {reminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Active Reminders</h3>
              <p className="text-muted-foreground">
                Set up treatment reminders from the treatment page
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {reminders.map((reminder) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {reminder.treatmentName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          For {reminder.diseaseName}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.nextDue)}`}>
                      {formatTimeUntil(reminder.nextDue)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <span className="font-medium text-muted-foreground">Next Due:</span>
                      <p className="text-foreground">
                        {new Date(reminder.nextDue).toLocaleDateString()} at{' '}
                        {new Date(reminder.nextDue).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Dosage:</span>
                      <p className="text-foreground">{reminder.dosage}</p>
                    </div>
                  </div>

                  {reminder.instructions && (
                    <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-foreground">{reminder.instructions}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Completed {reminder.completedCount} times
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplete(reminder.id)}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(reminder.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReminderList;