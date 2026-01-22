import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  Calendar, 
  Bell, 
  Zap, 
  Plus,
  Trash2,
  CheckCircle,
  Droplets,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import reminderService from '../../services/reminderService';
import { useAlerts } from '../alerts/AlertProvider';

const ReminderModal = ({ isOpen, onClose, treatment, diseaseInfo }) => {
  const [scheduleType, setScheduleType] = useState('ai');
  const [customSchedule, setCustomSchedule] = useState([]);
  const [aiSchedule, setAiSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAlerts();

  React.useEffect(() => {
    if (isOpen && treatment) {
      const schedule = reminderService.generateAISchedule(treatment, diseaseInfo);
      setAiSchedule(schedule);
      
      setCustomSchedule([{
        id: Date.now(),
        datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        note: ''
      }]);
    }
  }, [isOpen, treatment, diseaseInfo]);

  const addCustomReminder = () => {
    setCustomSchedule([...customSchedule, {
      id: Date.now(),
      datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      note: ''
    }]);
  };

  const removeCustomReminder = (id) => {
    setCustomSchedule(customSchedule.filter(r => r.id !== id));
  };

  const updateCustomReminder = (id, field, value) => {
    setCustomSchedule(customSchedule.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (scheduleType === 'ai') {
        aiSchedule.forEach((item) => {
          reminderService.createReminder(treatment, diseaseInfo, {
            customTime: item.dueTime,
            note: item.description,
            scheduleType: 'ai'
          });
        });
        showSuccess(`${aiSchedule.length} AI reminders set successfully!`);
      } else {
        let count = 0;
        customSchedule.forEach(item => {
          if (item.datetime) {
            reminderService.createReminder(treatment, diseaseInfo, {
              customTime: new Date(item.datetime),
              note: item.note,
              scheduleType: 'manual'
            });
            count++;
          }
        });
        showSuccess(`${count} custom reminders set successfully!`);
      }
      onClose();
    } catch (error) {
      showError('Failed to set reminders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const treatmentName = treatment?.name || 'Neem Oil Spray';
  const dosage = treatment?.dosage || '5ml per liter of water';
  const frequency = treatment?.frequency || 'Every 7-10 days';
  const instructions = treatment?.instructions || 'Apply in evening to avoid leaf burn. Mix with mild soap for better adherence.';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Set Treatment Reminders</h2>
                <p className="text-white/90 text-sm mt-1">for {treatmentName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Treatment Details */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Dosage</span>
                </div>
                <p className="text-gray-900 font-semibold">{dosage}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-700">Frequency</span>
                </div>
                <p className="text-gray-900 font-semibold">{frequency}</p>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <span className="font-medium text-blue-900">Application Instructions</span>
                  <p className="text-blue-800 text-sm mt-1 leading-relaxed">{instructions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Options */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Reminder Schedule</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* AI Recommended */}
              <div
                onClick={() => setScheduleType('ai')}
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  scheduleType === 'ai' 
                    ? 'border-green-500 bg-green-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    scheduleType === 'ai' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-900">AI Recommended</span>
                </div>
                <p className="text-sm text-gray-600">Optimal timing based on treatment frequency and best practices</p>
                {scheduleType === 'ai' && (
                  <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-green-500" />
                )}
              </div>

              {/* Custom Schedule */}
              <div
                onClick={() => setScheduleType('manual')}
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  scheduleType === 'manual' 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    scheduleType === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-gray-900">Custom Schedule</span>
                </div>
                <p className="text-sm text-gray-600">Set your own reminder times based on your schedule</p>
                {scheduleType === 'manual' && (
                  <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-blue-500" />
                )}
              </div>
            </div>

            {/* Schedule Content */}
            {scheduleType === 'ai' && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 mb-3">AI Generated Schedule ({aiSchedule.length} reminders)</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {aiSchedule.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {item.dueTime.toLocaleDateString()} at {item.dueTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scheduleType === 'manual' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Custom Reminders</h4>
                  <button
                    onClick={addCustomReminder}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-3 h-3 inline mr-1" />
                    Add
                  </button>
                </div>
                
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {customSchedule.map((reminder) => (
                    <div key={reminder.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="datetime-local"
                          value={reminder.datetime}
                          onChange={(e) => updateCustomReminder(reminder.id, 'datetime', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Add note (optional)"
                          value={reminder.note}
                          onChange={(e) => updateCustomReminder(reminder.id, 'note', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      {customSchedule.length > 1 && (
                        <button
                          onClick={() => removeCustomReminder(reminder.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Set Reminder Button and Confirmation Message */}
        <div className="bg-gray-50 border-t p-6">
          {/* Set Reminder Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Setting Reminders...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Set Reminder
                </>
              )}
            </button>
          </div>
          
          {/* Confirmation Message - Highly Visible */}
          <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold text-green-900 text-base">
                  Reminders will trigger notifications at the scheduled time
                </p>
                <p className="text-green-700 text-sm mt-1">
                  You'll receive push notifications to ensure timely treatment
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReminderModal;