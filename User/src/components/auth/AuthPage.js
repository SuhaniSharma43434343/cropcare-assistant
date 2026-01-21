import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff,
  ArrowRight,
  Sprout,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useAlerts } from '../alerts/AlertProvider';
import CropSelection from './CropSelection';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1: Basic Info, 2: Crop Selection
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    farmSize: '',
    selectedCrops: []
  });

  const { login, signup, loading } = useAuth();
  const { showSuccess, showError } = useAlerts();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSignUp) {
      if (signupStep === 1) {
        // Validation for basic info
        if (!formData.name || !formData.email || !formData.password) {
          showError('Please fill in all required fields');
          return;
        }
        
        if (formData.password.length < 6) {
          showError('Password must be at least 6 characters long');
          return;
        }

        // Move to crop selection step
        setSignupStep(2);
        return;
      }
      
      if (signupStep === 2) {
        // Validation for crop selection
        if (formData.selectedCrops.length === 0) {
          showError('Please select at least one crop');
          return;
        }

        const result = await signup({
          ...formData,
          farmDetails: {
            location: formData.location,
            size: formData.farmSize,
            phone: formData.phone
          }
        });
        
        if (result.success) {
          showSuccess('Account created successfully! Welcome to CropCare AI');
        } else {
          showError(result.error);
        }
      }
    } else {
      // Validation for signin
      if (!formData.email || !formData.password) {
        showError('Please enter email and password');
        return;
      }

      const result = await login(formData.email, formData.password);
      if (result.success) {
        showSuccess('Welcome back to CropCare AI!');
      } else {
        showError(result.error);
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setSignupStep(1);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      location: '',
      farmSize: '',
      selectedCrops: []
    });
  };

  const handleCropChange = (selectedCrops) => {
    setFormData({ ...formData, selectedCrops });
  };

  const goBackToStep1 = () => {
    setSignupStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl gradient-primary flex items-center justify-center shadow-glow">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CropCare AI</h1>
          <p className="text-gray-600">
            {isSignUp ? 'Join thousands of smart farmers' : 'Welcome back, farmer!'}
          </p>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-8 shadow-xl"
        >
          <div className="flex mb-6">
            <button
              onClick={() => !isSignUp && toggleMode()}
              className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${
                !isSignUp 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => isSignUp && toggleMode()}
              className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${
                isSignUp 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isSignUp && signupStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Name Field */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Location Field */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      placeholder="Farm Location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Farm Size Field */}
                  <div className="relative">
                    <Sprout className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                    >
                      <option value="">Select Farm Size</option>
                      <option value="small">Small (less than 1 acre)</option>
                      <option value="medium">Medium (1-10 acres)</option>
                      <option value="large">Large (more than 10 acres)</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {isSignUp && signupStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CropSelection
                    selectedCrops={formData.selectedCrops}
                    onCropChange={handleCropChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {(!isSignUp || signupStep === 1) && (
              <>
                {/* Email Field */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password *"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3 mt-6">
              {isSignUp && signupStep === 2 && (
                <Button
                  type="button"
                  onClick={goBackToStep1}
                  variant="outline"
                  className="flex-1 py-3"
                  size="lg"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={loading}
                className={`py-3 ${isSignUp && signupStep === 2 ? 'flex-1' : 'w-full'}`}
                size="lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <>                  
                    {isSignUp && signupStep === 1 ? (
                      <ChevronRight className="w-5 h-5 mr-2" />
                    ) : (
                      <ArrowRight className="w-5 h-5 mr-2" />
                    )}
                  </>
                )}
                {loading ? 'Processing...' : 
                  isSignUp ? 
                    (signupStep === 1 ? 'Next: Select Crops' : 'Create Account') : 
                    'Sign In'
                }
              </Button>
            </div>
          </form>

          {/* Toggle Mode */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-primary font-medium hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 mb-4">Join thousands of farmers using AI for better crops</p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <span>🌱 Disease Detection</span>
            <span>📊 Health Tracking</span>
            <span>🔔 Smart Alerts</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;