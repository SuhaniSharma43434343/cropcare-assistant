import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { useAlerts } from './AlertProvider';
import { PRIORITY_LEVELS } from './AlertSystem';
import { cn } from '../../lib/utils';

const AlertBell = ({ onClick, className }) => {
  const { alerts } = useAlerts();
  
  const unreadCount = alerts.length;
  const hasHighPriority = alerts.some(alert => 
    alert.priority === PRIORITY_LEVELS.HIGH || alert.priority === PRIORITY_LEVELS.CRITICAL
  );
  const hasCritical = alerts.some(alert => alert.priority === PRIORITY_LEVELS.CRITICAL);

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onClick}
      className={cn('relative', className)}
    >
      <motion.div
        animate={hasHighPriority ? { rotate: [0, -10, 10, -10, 0] } : {}}
        transition={{ 
          duration: 0.5, 
          repeat: hasHighPriority ? Infinity : 0, 
          repeatDelay: 3 
        }}
      >
        <Bell className={cn(
          'w-5 h-5 transition-colors',
          hasCritical ? 'text-red-500' : hasHighPriority ? 'text-orange-500' : 'text-muted-foreground'
        )} />
      </motion.div>
      
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white',
            hasCritical ? 'bg-red-500 animate-pulse' : hasHighPriority ? 'bg-orange-500' : 'bg-blue-500'
          )}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.div>
      )}
    </Button>
  );
};

export default AlertBell;