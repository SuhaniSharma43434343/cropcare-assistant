import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  BarChart3, 
  User, 
  Handshake, 
  Menu, 
  X,
  Leaf,
  Bell
} from 'lucide-react';
import AlertBell from '../alerts/AlertBell';
import AlertCenter from '../alerts/AlertCenter';

const VerticalSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertCenterOpen, setIsAlertCenterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Camera, label: 'Scan Crop', path: '/capture' },
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Handshake, label: 'Farm Connect', path: '/farm-connect' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
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
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl z-40 lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  CropCare AI
                </h1>
                <p className="text-xs text-gray-500">Smart Farming Solutions</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item.path);
                const Icon = item.icon;
                
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      relative w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm
                      transition-all duration-200 group
                      ${isActive 
                        ? 'text-green-600 bg-green-50 border border-green-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute inset-0 bg-green-50 rounded-xl border border-green-200"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-green-600' : ''}`} />
                    <span className="relative z-10">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Notifications</span>
              <AlertBell 
                onClick={() => setIsAlertCenterOpen(true)}
                className="hover:bg-gray-100 p-2 rounded-xl transition-colors"
              />
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Alert Center */}
      <AlertCenter 
        isOpen={isAlertCenterOpen}
        onClose={() => setIsAlertCenterOpen(false)}
      />
    </>
  );
};

export default VerticalSidebar;