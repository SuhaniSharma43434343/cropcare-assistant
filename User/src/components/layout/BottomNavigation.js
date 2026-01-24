import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Camera, BarChart3, User, Handshake } from "lucide-react";

const navItems = [
  { 
    icon: Home, 
    label: "Home", 
    path: "/",
    ariaLabel: "Navigate to home page"
  },
  { 
    icon: Camera, 
    label: "Scan", 
    path: "/capture",
    ariaLabel: "Start crop scanning"
  },
  { 
    icon: Handshake, 
    label: "Connect", 
    path: "/farm-connect",
    ariaLabel: "Connect farmers and investors"
  },
  { 
    icon: BarChart3, 
    label: "Dashboard", 
    path: "/dashboard",
    ariaLabel: "View dashboard and analytics"
  },
  { 
    icon: User, 
    label: "Profile", 
    path: "/profile",
    ariaLabel: "View and edit profile"
  },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    // Add haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    navigate(path);
  };

  const handleKeyDown = (e, path) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigation(path);
    }
  };

  // Helper function to check if nav item is active
  const isNavItemActive = (itemPath) => {
    // Handle root path and home path as the same
    if (itemPath === '/' && (location.pathname === '/' || location.pathname === '/home')) {
      return true;
    }
    return location.pathname === itemPath;
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 safe-area-bottom"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Navigation Container */}
      <div className="max-w-md mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                onKeyDown={(e) => handleKeyDown(e, item.path)}
                className={`
                  relative flex flex-col items-center gap-1 py-2 px-3 sm:px-4 
                  rounded-xl transition-all duration-200 
                  min-w-[44px] min-h-[44px] 
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                  ${isActive 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-green-50 dark:bg-green-900/30 rounded-xl"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}

                {/* Icon with Animation */}
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -1 : 0
                  }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className="relative z-10"
                >
                  <Icon 
                    className={`
                      w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200
                      ${isActive 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-500 dark:text-gray-400'
                      }
                    `} 
                  />
                </motion.div>

                {/* Label */}
                <span 
                  className={`
                    text-xs font-medium transition-colors duration-200 relative z-10
                    ${isActive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {item.label}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 w-1 h-1 bg-green-600 dark:bg-green-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Safe Area for iOS */}
      <div className="h-safe-area-inset-bottom bg-white/95 dark:bg-gray-900/95" />
    </nav>
  );
};

export default BottomNavigation;