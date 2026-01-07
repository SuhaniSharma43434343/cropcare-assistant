import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle, Share2, Bookmark, ChevronRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/layout/MobileLayout";

const Diagnosis = () => {
  const navigate = useNavigate();

  const diagnosis = {
    disease: "Tomato Late Blight",
    confidence: 94,
    severity: "Moderate",
    affectedArea: 35,
    description:
      "Late blight is caused by the fungus-like organism Phytophthora infestans. It can destroy a tomato crop within days if left untreated.",
    symptoms: [
      "Dark brown spots on leaves",
      "White fuzzy growth on undersides",
      "Rapid wilting of affected areas",
      "Fruit showing brown lesions",
    ],
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "mild":
        return "bg-success/10 text-success border-success/30";
      case "moderate":
        return "bg-warning/10 text-warning border-warning/30";
      case "severe":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-background safe-area-top">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <h1 className="text-lg font-display font-semibold">Diagnosis Result</h1>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon-sm">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Image with Highlight */}
        <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden shadow-card">
          <div className="aspect-[4/3] bg-gradient-to-br from-muted to-secondary flex items-center justify-center relative">
            <Leaf className="w-32 h-32 text-primary/30" />
            
            {/* Affected Area Highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-1/3 left-1/3 w-24 h-24"
            >
              <div className="absolute inset-0 border-2 border-destructive rounded-full animate-pulse-ring" />
              <div className="absolute inset-2 border-2 border-dashed border-destructive/60 rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-1/4 right-1/4 w-16 h-16"
            >
              <div className="absolute inset-0 border-2 border-warning rounded-full animate-pulse-ring" />
            </motion.div>
          </div>

          {/* Confidence Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-semibold">{diagnosis.confidence}% Match</span>
            </div>
          </motion.div>
        </div>

        {/* Disease Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 py-6"
        >
          {/* Disease Name & Severity */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                {diagnosis.disease}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Fungal Disease • {diagnosis.affectedArea}% affected
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(
                diagnosis.severity
              )}`}
            >
              {diagnosis.severity}
            </span>
          </div>

          {/* Warning Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-warning/10 border border-warning/30 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Immediate Action Required
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This disease spreads rapidly. Start treatment within 24-48 hours for best results.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">About this Disease</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {diagnosis.description}
            </p>
          </div>

          {/* Symptoms */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Identified Symptoms</h3>
            <div className="space-y-2">
              {diagnosis.symptoms.map((symptom, index) => (
                <motion.div
                  key={symptom}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl"
                >
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <span className="text-sm text-foreground">{symptom}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-8">
            <Button
              variant="gradient"
              size="xl"
              className="w-full"
              onClick={() => navigate("/treatment")}
            >
              View Treatment Options
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/voice")}
            >
              Ask AI Assistant
            </Button>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default Diagnosis;
