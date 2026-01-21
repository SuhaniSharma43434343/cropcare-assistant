import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import BottomNavigation from "./BottomNavigation";

const MobileLayout = ({ children, showNav = true, className = "" }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [screenSize, setScreenSize] = useState('mobile');

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

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 576) {
        setScreenSize('mobile');
      } else if (width <= 768) {
        setScreenSize('tablet');
      } else if (width <= 992) {
        setScreenSize('laptop');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
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

      {/* Main Content Area */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`
          flex-1 overflow-y-auto scrollbar-thin
          ${showNav ? 'pb-20 md:pb-24' : ''} 
          ${className}
        `}
        role="main"
        aria-label="Main content"
      >
        {/* Responsive Container */}
        <div className={`
          w-full mx-auto
          ${screenSize === 'mobile' ? 'max-w-full' : ''}
          ${screenSize === 'tablet' ? 'max-w-2xl' : ''}
          ${screenSize === 'laptop' ? 'max-w-4xl' : ''}
          ${screenSize === 'desktop' ? 'max-w-6xl' : ''}
        `}>
          {children}
        </div>
      </motion.main>

      {/* Bottom Navigation */}
      {showNav && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <BottomNavigation />
        </motion.div>
      )}

      {/* Focus Trap for Accessibility */}
      <div 
        tabIndex={0} 
        onFocus={(e) => {
          // Move focus to first focusable element
          const firstFocusable = document.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default MobileLayout;