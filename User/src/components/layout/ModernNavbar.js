import { useState } from 'react';
import { motion } from 'framer-motion';
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

const ModernNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  CropCare AI
                </h1>
                <p className="text-xs text-gray-500">Smart Farming Solutions</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm
                      transition-all duration-200 hover:bg-gray-50
                      ${isActive 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute inset-0 bg-green-50 rounded-xl border border-green-200"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-green-600' : ''}`} />
                    <span className="relative z-10">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Alert Bell */}
              <AlertBell 
                onClick={() => setIsAlertCenterOpen(true)}
                className="hover:bg-gray-100 p-2 rounded-xl transition-colors"
              />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                        transition-all duration-200
                        ${isActive 
                          ? 'text-green-600 bg-green-50 border border-green-200' 
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : ''}`} />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Alert Center */}
      <AlertCenter 
        isOpen={isAlertCenterOpen}
        onClose={() => setIsAlertCenterOpen(false)}
      />
    </>
  );
};

export default ModernNavbar;