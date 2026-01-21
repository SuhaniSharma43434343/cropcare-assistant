import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  Mic, 
  Leaf, 
  Shield, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Zap
} from "lucide-react";
import { Button } from "../components/ui/button";
import MobileLayout from "../components/layout/MobileLayout";
import AlertBell from "../components/alerts/AlertBell";
import AlertCenter from "../components/alerts/AlertCenter";
import { useAlerts } from "../components/alerts/AlertProvider";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertCenter, setShowAlertCenter] = useState(false);
  const { showSuccess, showInfo } = useAlerts();
  const { user } = useAuth();

  const features = [
    {
      icon: Camera,
      title: "AI-Powered Scanning",
      description: "Advanced computer vision technology for instant disease detection",
      path: "/capture"
    },
    {
      icon: Shield,
      title: "Treatment Plans",
      description: "Personalized organic and chemical treatment recommendations",
      path: "/treatment"
    },
    {
      icon: TrendingUp,
      title: "Health Tracking",
      description: "Monitor crop conditions and track recovery progress",
      path: "/dashboard"
    },
    {
      icon: Sparkles,
      title: "Alert System Demo",
      description: "Experience our smart notification and alert system",
      path: "/alert-demo"
    }
  ];

  const stats = [
    { number: "50K+", label: "Farmers Helped", icon: Users },
    { number: "95%", label: "Accuracy Rate", icon: Award },
    { number: "24/7", label: "AI Support", icon: Zap }
  ];

  const handleScanClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/capture");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-8 safe-area-top">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CropCare AI</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.name?.split(' ')[0] || 'Farmer'}!
              </p>
            </div>
          </div>
          <AlertBell onClick={() => setShowAlertCenter(true)} />
        </motion.div>

        {/* Main Green Box - Matching Existing Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl gradient-primary p-6 mb-6 shadow-glow"
        >
          <div className="relative z-10 text-left lg:text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Protect Your Crops
            </h2>
            <p className="text-white/80 text-sm mb-6 max-w-[200px] lg:max-w-none lg:mx-auto">
              Detect diseases early and get expert treatment recommendations instantly.
            </p>
            <button
              onClick={handleScanClick}
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-white/20 text-white border border-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Scan Your Crop
                </>
              )}
            </button>
          </div>
          
          {/* Background Decorative Elements */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-4 top-4 w-24 h-24 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Leaf className="w-12 h-12 text-white/60" />
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <button
            onClick={() => {
              handleScanClick();
              showInfo('Camera initialized successfully!');
            }}
            className="flex flex-col items-center justify-center h-auto py-6 gap-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-all duration-200 shadow-lg"
          >
            <Camera className="w-8 h-8" />
            <span className="font-medium">Scan Crop</span>
          </button>
          <button
            onClick={() => {
              navigate("/voice");
              showSuccess('Voice assistant activated!');
            }}
            className="flex flex-col items-center justify-center h-auto py-6 gap-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-2xl transition-all duration-200"
          >
            <Mic className="w-8 h-8" />
            <span className="font-medium">Talk to AI</span>
          </button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Smart Features
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(feature.path)}
                >
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-3">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Progress
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label}>
                  <div className="flex justify-center mb-2">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.number}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
      
      <AlertCenter 
        isOpen={showAlertCenter} 
        onClose={() => setShowAlertCenter(false)} 
      />
    </MobileLayout>
  );
};

export default Home;