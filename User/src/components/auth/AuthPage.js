import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useAlerts } from '../alerts/AlertProvider';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
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
      // Validation for signup
      if (!formData.phone || !formData.password) {
        showError('Please fill in all required fields');
        return;
      }
      
      if (formData.password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
      }

      const result = await signup(formData);
      
      if (result.success) {
        showSuccess('Account created successfully! Welcome to CropCare AI');
        // Navigate to dashboard after successful signup
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        showError(result.error || 'Registration failed. Please try again.');
      }
    } else {
      // Validation for signin
      if (!formData.phone || !formData.password) {
        showError('Please enter phone number and password');
        return;
      }

      const result = await login(formData.phone, formData.password);
      if (result.success) {
        showSuccess('Welcome back to CropCare AI!');
        // Navigate to dashboard after successful login
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        showError(result.error || 'Login failed. Please check your credentials.');
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      phone: '',
      password: ''
    });
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
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${
                !isSignUp 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
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
            {/* Phone Field */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
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

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3"
                size="lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
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