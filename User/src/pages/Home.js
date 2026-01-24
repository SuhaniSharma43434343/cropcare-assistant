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
import SidebarLayout from "../components/layout/SidebarLayout";
import WeatherMarketSection from "../components/WeatherMarketSection";
import CitySelector from "../components/CitySelector";
import { useAlerts } from "../components/alerts/AlertProvider";
import { useAuth } from "../contexts/AuthContext";
import { useCrop } from "../contexts/CropContext";

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [currentLocation, setCurrentLocation] = useState(null);
  const { showSuccess, showInfo } = useAlerts();
  const { user } = useAuth();
  const { getSelectedCropForDiagnosis } = useCrop();

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
      description: "Comprehensive treatment plans for 45+ common crop diseases",
      path: "/treatment-plans"
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

  const handleCityChange = (city, coords = null) => {
    setSelectedCity(city);
    if (coords) {
      console.log('Location coordinates:', coords);
    }
  };

  const handleScanClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/capture");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto lg:max-w-none">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-lg text-gray-600">
                  Welcome back, {user?.name?.split(' ')[0] || 'किसान'}!
                </p>
              </div>
            </div>
          </motion.div>





        {/* Main Action Buttons - Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          {/* Protect Your Crops Button */}
          <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 shadow-glow">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">
                Protect Your Crops
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Detect diseases early and get expert treatment recommendations instantly.
              </p>
              <button
                onClick={handleScanClick}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-white/20 text-white border border-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
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
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-3 top-3 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Leaf className="w-6 h-6 text-white/60" />
            </motion.div>
          </div>

          {/* Talk to AI Button */}
          <div className="bg-white border-2 border-green-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-green-700 group">
            <div className="h-full flex flex-col">
              <h3 className="text-xl font-bold text-green-600 mb-2 group-hover:text-green-700">
                Talk to AI
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-1">
                Get instant answers and guidance through our intelligent voice assistant.
              </p>
              <button
                onClick={() => {
                  navigate("/voice");
                  showSuccess('Voice assistant activated!');
                }}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                <Mic className="w-5 h-5" />
                Start Voice Chat
              </button>
            </div>
          </div>
        </motion.div>

        {/* Weather and Market Prices Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <WeatherMarketSection />
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
          transition={{ delay: 0.35 }}
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
      </div>
    </SidebarLayout>
  );
};

export default Home;