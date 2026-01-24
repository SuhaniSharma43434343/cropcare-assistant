import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ModernNavbar from './ModernNavbar';

const ModernLayout = ({ children, className = '' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Offline Banner */}
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium z-50"
          role="alert"
          aria-live="polite"
        >
          You're offline. Some features may not be available.
        </motion.div>
      )}

      {/* Modern Navbar */}
      <ModernNavbar />

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`${className}`}
        role="main"
        aria-label="Main content"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default ModernLayout;