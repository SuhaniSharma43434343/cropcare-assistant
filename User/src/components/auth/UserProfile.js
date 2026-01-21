import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Sprout, 
  Edit3, 
  LogOut, 
  Save, 
  X,
  Camera,
  Settings,
  Plus
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useAlerts } from '../alerts/AlertProvider';
import { CROP_OPTIONS } from '../../contexts/CropContext';
import CropSelection from './CropSelection';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile } = useAuth();
  const { showSuccess, showError } = useAlerts();
  const [isEditing, setIsEditing] = useState(false);
  const [showCropSelection, setShowCropSelection] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.farmDetails?.phone || '',
    location: user?.farmDetails?.location || '',
    farmSize: user?.farmDetails?.size || '',
    selectedCrops: user?.selectedCrops || []
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCropChange = (selectedCrops) => {
    setFormData({ ...formData, selectedCrops });
  };

  const handleSave = () => {
    const profileData = {
      name: formData.name,
      selectedCrops: formData.selectedCrops,
      farmDetails: {
        phone: formData.phone,
        location: formData.location,
        size: formData.farmSize
      }
    };
    
    const result = updateProfile(profileData);
    if (result.success) {
      showSuccess('Profile updated successfully!');
      setIsEditing(false);
      setShowCropSelection(false);
    } else {
      showError(result.error);
    }
  };

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully!');
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.farmDetails?.phone || '',
      location: user?.farmDetails?.location || '',
      farmSize: user?.farmDetails?.size || '',
      selectedCrops: user?.selectedCrops || []
    });
    setIsEditing(false);
    setShowCropSelection(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Profile</h2>
                <p className="text-sm opacity-90">{user?.email}</p>
              </div>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Content */}
          <div className="flex-1 p-6">
            {/* Profile Picture Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-xl font-semibold text-foreground mt-3">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-muted/30 rounded-lg text-foreground">
                    {user?.name || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <p className="px-3 py-2 bg-muted/30 rounded-lg text-foreground">
                  {user?.email}
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-muted/30 rounded-lg text-foreground">
                    {user?.farmDetails?.phone || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Farm Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <p className="px-3 py-2 bg-muted/30 rounded-lg text-foreground">
                    {user?.farmDetails?.location || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Farm Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Sprout className="w-4 h-4" />
                  Farm Size
                </label>
                {isEditing ? (
                  <select
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Farm Size</option>
                    <option value="small">Small (less than 1 acre)</option>
                    <option value="medium">Medium (1-10 acres)</option>
                    <option value="large">Large (more than 10 acres)</option>
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-muted/30 rounded-lg text-foreground">
                    {user?.farmDetails?.size ? 
                      user.farmDetails.size.charAt(0).toUpperCase() + user.farmDetails.size.slice(1) : 
                      'Not provided'
                    }
                  </p>
                )}
              </div>

              {/* Selected Crops */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Sprout className="w-4 h-4" />
                  Selected Crops
                </label>
                <div className="px-3 py-2 bg-muted/30 rounded-lg">
                  {user?.selectedCrops && user.selectedCrops.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.selectedCrops.map((cropId) => {
                        const crop = CROP_OPTIONS.find(c => c.id === cropId);
                        return crop ? (
                          <span
                            key={cropId}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                          >
                            <span>{crop.icon}</span>
                            {crop.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-foreground">No crops selected</p>
                  )}
                </div>
                <Button
                  onClick={() => setShowCropSelection(true)}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Change Crops
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              {isEditing || showCropSelection ? (
                <div className="flex gap-3">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-muted/30">
            <Button 
              onClick={handleLogout} 
              variant="destructive" 
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Crop Selection Modal */}
        <AnimatePresence>
          {showCropSelection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setShowCropSelection(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Update Your Crops</h3>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setShowCropSelection(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <CropSelection
                  selectedCrops={formData.selectedCrops}
                  onCropChange={handleCropChange}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;