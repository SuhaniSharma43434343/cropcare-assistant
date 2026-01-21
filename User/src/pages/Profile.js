import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Globe, 
  Volume2, 
  Download, 
  HelpCircle, 
  FileText, 
  ChevronRight,
  Leaf,
  Bell,
  Moon,
  Shield,
  LogOut,
  ExternalLink,
  Edit3
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import MobileLayout from "../components/layout/MobileLayout";
import { useAuth } from "../contexts/AuthContext";
import { useCrop } from "../contexts/CropContext";
import { useAlerts } from "../components/alerts/AlertProvider";
import UserProfile from "../components/auth/UserProfile";

const Profile = () => {
  const [offlineMode, setOfflineMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  const { user, logout } = useAuth();
  const { getUserCrops } = useCrop();
  const { showSuccess } = useAlerts();
  
  const userCrops = getUserCrops();

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully!');
  };

  const languages = ["English", "हिंदी", "मराठी", "తెలుగు", "தமிழ்"];
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const menuItems = [
    {
      icon: Globe,
      label: "Language",
      value: selectedLanguage,
      action: "language",
    },
    {
      icon: Volume2,
      label: "Voice Assistant",
      toggle: true,
      value: voiceEnabled,
      onToggle: () => setVoiceEnabled(!voiceEnabled),
    },
    {
      icon: Bell,
      label: "Notifications",
      toggle: true,
      value: notifications,
      onToggle: () => setNotifications(!notifications),
    },
    {
      icon: Download,
      label: "Offline Mode",
      toggle: true,
      value: offlineMode,
      onToggle: () => setOfflineMode(!offlineMode),
      description: "Download disease data for offline use",
    },
  ];

  const supportItems = [
    { icon: HelpCircle, label: "Help & Support", href: "#" },
    { icon: FileText, label: "Government Schemes", href: "#", badge: "New" },
    { icon: Shield, label: "Privacy Policy", href: "#" },
  ];

  return (
    <MobileLayout>
      <div className="px-4 pt-6 safe-area-top">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-display font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your settings</p>
        </motion.div>

        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5 shadow-card mb-6 cursor-pointer"
          onClick={() => setShowUserProfile(true)}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{user?.name || 'User'}</h2>
              <p className="text-sm text-muted-foreground">{user?.location || 'Location not set'}</p>
            </div>
            <Edit3 className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {userCrops.length > 0 ? (
              userCrops.map((crop) => (
                <span
                  key={crop.id}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium flex items-center gap-1"
                >
                  <span>{crop.icon}</span>
                  {crop.name}
                </span>
              ))
            ) : (
              <span className="px-3 py-1 bg-muted/30 text-muted-foreground rounded-full text-xs">
                No crops selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Scans this month</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">Member since</p>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">Settings</h3>
          <div className="glass-card rounded-2xl overflow-hidden shadow-card">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-4 ${
                    index !== menuItems.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                  {item.toggle ? (
                    <Switch
                      checked={item.value}
                      onCheckedChange={item.onToggle}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">Support</h3>
          <div className="glass-card rounded-2xl overflow-hidden shadow-card">
            {supportItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex items-center justify-between p-4 w-full text-left hover:bg-muted/50 transition-colors ${
                    index !== supportItems.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Government Schemes Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="gradient-primary rounded-2xl p-5 mb-6 shadow-glow"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary-foreground mb-1">
                Government Schemes
              </h3>
              <p className="text-sm text-primary-foreground/80 mb-3">
                Explore agricultural subsidies and support programs available in your area.
              </p>
              <Button
                variant="glass"
                size="sm"
                className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
              >
                Learn More
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pb-6"
        >
          <Button 
            variant="outline" 
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground pb-6">
          CropCare AI v1.0.0
        </p>
      </div>
      
      <UserProfile 
        isOpen={showUserProfile} 
        onClose={() => setShowUserProfile(false)} 
      />
    </MobileLayout>
  );
};

export default Profile;