class ReminderService {
  constructor() {
    this.reminders = this.loadReminders();
    this.activeTimeouts = new Map();
    this.initializeReminders();
  }

  loadReminders() {
    try {
      return JSON.parse(localStorage.getItem('cropcare_reminders') || '[]');
    } catch {
      return [];
    }
  }

  saveReminders() {
    localStorage.setItem('cropcare_reminders', JSON.stringify(this.reminders));
  }

  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  parseFrequency(frequency) {
    const match = frequency.match(/(\d+)(?:-(\d+))?\s*(day|hour)s?/i);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days
    
    const min = parseInt(match[1]);
    const max = match[2] ? parseInt(match[2]) : min;
    const avg = (min + max) / 2;
    const unit = match[3].toLowerCase();
    
    return unit === 'day' ? avg * 24 * 60 * 60 * 1000 : avg * 60 * 60 * 1000;
  }

  createReminder(treatment, diseaseInfo, options = {}) {
    const id = this.generateId();
    const now = new Date();
    const interval = this.parseFrequency(treatment.frequency);
    
    const reminder = {
      id,
      treatmentName: treatment.name,
      diseaseName: diseaseInfo.name,
      dosage: treatment.dosage,
      instructions: treatment.instructions,
      warning: treatment.warning,
      nextDue: options.customTime || new Date(now.getTime() + interval),
      interval,
      isActive: true,
      completedCount: 0,
      createdAt: now.toISOString(),
      ...options
    };

    this.reminders.push(reminder);
    this.saveReminders();
    this.scheduleReminder(reminder);
    
    return reminder;
  }

  scheduleReminder(reminder) {
    if (!reminder.isActive) return;
    
    const now = new Date();
    const dueTime = new Date(reminder.nextDue);
    const delay = dueTime.getTime() - now.getTime();
    
    if (delay <= 0) {
      this.triggerReminder(reminder);
      return;
    }

    const timeoutId = setTimeout(() => {
      this.triggerReminder(reminder);
    }, delay);
    
    this.activeTimeouts.set(reminder.id, timeoutId);
  }

  triggerReminder(reminder) {
    // Show notification
    this.showNotification(reminder);
    
    // Play sound if supported
    this.playNotificationSound();
    
    // Update next due time
    reminder.nextDue = new Date(Date.now() + reminder.interval);
    this.saveReminders();
    
    // Schedule next reminder
    this.scheduleReminder(reminder);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('treatmentReminder', { 
      detail: reminder 
    }));
  }

  showNotification(reminder) {
    const title = `🌱 Treatment Reminder`;
    const body = `Apply ${reminder.treatmentName} for ${reminder.diseaseName}`;
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: reminder.id,
        requireInteraction: true
      });
    }
  }

  playNotificationSound() {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {}
  }

  completeReminder(id) {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.completedCount++;
      reminder.lastCompleted = new Date().toISOString();
      this.saveReminders();
    }
  }

  snoozeReminder(id, minutes = 30) {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.nextDue = new Date(Date.now() + minutes * 60 * 1000);
      this.saveReminders();
      
      // Clear existing timeout and reschedule
      if (this.activeTimeouts.has(id)) {
        clearTimeout(this.activeTimeouts.get(id));
        this.activeTimeouts.delete(id);
      }
      this.scheduleReminder(reminder);
    }
  }

  deleteReminder(id) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.saveReminders();
    
    if (this.activeTimeouts.has(id)) {
      clearTimeout(this.activeTimeouts.get(id));
      this.activeTimeouts.delete(id);
    }
  }

  getActiveReminders() {
    return this.reminders.filter(r => r.isActive);
  }

  initializeReminders() {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Schedule all active reminders
    this.reminders.forEach(reminder => {
      if (reminder.isActive) {
        this.scheduleReminder(reminder);
      }
    });
  }

  // Auto-generate reminder times based on AI recommendations
  generateAISchedule(treatment, diseaseInfo) {
    const now = new Date();
    const schedule = [];
    
    // Parse frequency to get interval
    const interval = this.parseFrequency(treatment.frequency);
    
    // Generate optimal times (early morning 6-8 AM or evening 6-8 PM)
    const getOptimalTime = (baseDate) => {
      const date = new Date(baseDate);
      const hour = Math.random() < 0.5 ? 6 + Math.random() * 2 : 18 + Math.random() * 2;
      date.setHours(Math.floor(hour), Math.floor(Math.random() * 60), 0, 0);
      return date;
    };
    
    // Generate next 5 applications
    for (let i = 0; i < 5; i++) {
      const dueTime = getOptimalTime(new Date(now.getTime() + interval * i));
      schedule.push({
        application: i + 1,
        dueTime,
        description: `Application ${i + 1} of ${treatment.name}`
      });
    }
    
    return schedule;
  }
}

export default new ReminderService();