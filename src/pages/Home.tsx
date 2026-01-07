import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Camera, Mic, Leaf, Shield, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/layout/MobileLayout";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Camera,
      title: "Instant Scan",
      description: "AI-powered disease detection",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Shield,
      title: "Treatment Plans",
      description: "Organic & chemical solutions",
      color: "bg-success/10 text-success",
    },
    {
      icon: TrendingUp,
      title: "Track Health",
      description: "Monitor crop conditions",
      color: "bg-info/10 text-info",
    },
    {
      icon: Sparkles,
      title: "AI Assistant",
      description: "24/7 farming expert",
      color: "bg-accent/10 text-accent-foreground",
    },
  ];

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
              <Leaf className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">CropCare AI</h1>
              <p className="text-sm text-muted-foreground">Your farming companion</p>
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl gradient-primary p-6 mb-6 shadow-glow"
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-display font-bold text-primary-foreground mb-2">
              Protect Your Crops
            </h2>
            <p className="text-primary-foreground/80 text-sm mb-6 max-w-[200px]">
              Detect diseases early and get expert treatment recommendations instantly.
            </p>
            <Button
              variant="glass"
              size="lg"
              onClick={() => navigate("/capture")}
              className="bg-card/20 text-primary-foreground border-primary-foreground/20 hover:bg-card/30"
            >
              <Camera className="w-5 h-5 mr-2" />
              Scan Your Crop
            </Button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-4 top-4 w-24 h-24 bg-accent/30 rounded-full flex items-center justify-center"
          >
            <Leaf className="w-12 h-12 text-primary-foreground/60" />
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <Button
            variant="gradient"
            size="xl"
            onClick={() => navigate("/capture")}
            className="flex-col h-auto py-6 gap-3"
          >
            <Camera className="w-8 h-8" />
            <span>Scan Crop</span>
          </Button>
          <Button
            variant="outline"
            size="xl"
            onClick={() => navigate("/voice")}
            className="flex-col h-auto py-6 gap-3 border-primary/30"
          >
            <Mic className="w-8 h-8" />
            <span>Talk to AI</span>
          </Button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">
            Smart Features
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass-card rounded-2xl p-4 shadow-card"
              >
                <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mb-3`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-5 shadow-card"
        >
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">
            Your Progress
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Scans Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">8</p>
              <p className="text-xs text-muted-foreground">Healthy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">4</p>
              <p className="text-xs text-muted-foreground">Treated</p>
            </div>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default Home;
