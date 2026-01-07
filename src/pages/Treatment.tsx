import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Leaf, 
  FlaskConical, 
  AlertTriangle, 
  Cloud, 
  Sun, 
  Droplets,
  Clock,
  Shield,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/layout/MobileLayout";

const Treatment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"organic" | "chemical">("organic");

  const organicTreatments = [
    {
      name: "Neem Oil Spray",
      dosage: "5ml per liter of water",
      frequency: "Every 7 days",
      effectiveness: 85,
      icon: Leaf,
    },
    {
      name: "Baking Soda Solution",
      dosage: "1 tbsp + 1L water + few drops soap",
      frequency: "Every 5-7 days",
      effectiveness: 75,
      icon: Droplets,
    },
    {
      name: "Copper Fungicide (Organic)",
      dosage: "2g per liter of water",
      frequency: "Every 10-14 days",
      effectiveness: 90,
      icon: Shield,
    },
  ];

  const chemicalTreatments = [
    {
      name: "Mancozeb 75% WP",
      dosage: "2.5g per liter of water",
      frequency: "Every 7-10 days",
      effectiveness: 95,
      icon: FlaskConical,
      warning: "Use protective gear. Do not spray near water sources.",
    },
    {
      name: "Chlorothalonil",
      dosage: "2g per liter of water",
      frequency: "Every 7 days",
      effectiveness: 92,
      icon: FlaskConical,
      warning: "Wait 7 days before harvest. Toxic to fish.",
    },
  ];

  const treatments = activeTab === "organic" ? organicTreatments : chemicalTreatments;

  const safetyTips = [
    "Always wear gloves and mask when spraying",
    "Spray early morning or late evening",
    "Avoid spraying on windy days",
    "Keep children and pets away during application",
  ];

  const weatherTip = {
    icon: Cloud,
    title: "Weather-Based Recommendation",
    description: "Rain expected in 2 days. Apply treatment today for best absorption. Avoid spraying if rain is within 6 hours.",
  };

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-background safe-area-top">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <h1 className="text-lg font-display font-semibold">Treatment Plan</h1>
          
          <div className="w-10" />
        </div>

        <div className="px-4 py-4">
          {/* Disease Reference */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 glass-card rounded-2xl mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Tomato Late Blight</h2>
              <p className="text-sm text-muted-foreground">Moderate severity • 35% affected</p>
            </div>
          </motion.div>

          {/* Treatment Type Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "organic" ? "gradient" : "secondary"}
              className="flex-1"
              onClick={() => setActiveTab("organic")}
            >
              <Leaf className="w-4 h-4 mr-2" />
              Organic
            </Button>
            <Button
              variant={activeTab === "chemical" ? "gradient" : "secondary"}
              className="flex-1"
              onClick={() => setActiveTab("chemical")}
            >
              <FlaskConical className="w-4 h-4 mr-2" />
              Chemical
            </Button>
          </div>

          {/* AI Weather Tip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-info/10 border border-info/30 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-info/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  {weatherTip.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {weatherTip.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Treatment Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 mb-6"
            >
              {treatments.map((treatment, index) => (
                <motion.div
                  key={treatment.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-4 shadow-card"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activeTab === "organic" ? "bg-success/10" : "bg-warning/10"
                    }`}>
                      <treatment.icon className={`w-6 h-6 ${
                        activeTab === "organic" ? "text-success" : "text-warning"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{treatment.name}</h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Droplets className="w-4 h-4" />
                          <span>Dosage: {treatment.dosage}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Apply {treatment.frequency}</span>
                        </div>
                      </div>

                      {/* Effectiveness Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Effectiveness</span>
                          <span className="text-foreground font-medium">{treatment.effectiveness}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${treatment.effectiveness}%` }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className={`h-full rounded-full ${
                              activeTab === "organic" ? "bg-success" : "bg-warning"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Warning for chemical */}
                      {"warning" in treatment && (
                        <div className="mt-3 flex items-start gap-2 p-2 bg-destructive/10 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-destructive">{(treatment as { warning: string }).warning}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Safety Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-warning/5 border border-warning/20 rounded-2xl p-4 mb-6"
          >
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-warning" />
              Safety Guidelines
            </h3>
            <div className="space-y-2">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-8">
            <Button variant="gradient" size="xl" className="w-full">
              Set Treatment Reminder
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/voice")}
            >
              Ask AI for More Help
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Treatment;
