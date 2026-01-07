import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Leaf, Scan, Brain, CheckCircle } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";

const analysisSteps = [
  { icon: Scan, label: "Scanning image...", duration: 1000 },
  { icon: Brain, label: "AI analyzing patterns...", duration: 1500 },
  { icon: Leaf, label: "Identifying disease...", duration: 1000 },
  { icon: CheckCircle, label: "Analysis complete!", duration: 500 },
];

const Analyzing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDurations = analysisSteps.map((step) => step.duration);
    let elapsed = 0;
    const totalDuration = stepDurations.reduce((a, b) => a + b, 0);

    const progressInterval = setInterval(() => {
      elapsed += 50;
      setProgress((elapsed / totalDuration) * 100);
    }, 50);

    let cumulativeDuration = 0;
    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
      }, cumulativeDuration);
      cumulativeDuration += step.duration;
    });

    // Navigate to diagnosis after all steps
    const timeout = setTimeout(() => {
      navigate("/diagnosis");
    }, totalDuration + 200);

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <MobileLayout showNav={false}>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 gradient-hero safe-area-top">
        {/* Animated Scanner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-12"
        >
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 rounded-full border-4 border-primary/20"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary" />
          </motion.div>

          {/* Middle Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-4 border-accent/30"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent" />
          </motion.div>

          {/* Inner Circle */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-10 rounded-full gradient-primary flex items-center justify-center shadow-glow"
          >
            <Leaf className="w-16 h-16 text-primary-foreground" />
          </motion.div>

          {/* Scan Line */}
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ top: "50%" }}
            animate={{ y: [-80, 80, -80] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mb-8">
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Analyzing</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Analysis Steps */}
        <div className="space-y-4 w-full max-w-xs">
          {analysisSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isComplete || isActive ? 1 : 0.4,
                  x: 0 
                }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${
                  isActive ? "glass-card shadow-card" : "bg-transparent"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isComplete
                      ? "bg-success/20 text-success"
                      : isActive
                      ? "gradient-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
                {isActive && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-auto w-2 h-2 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Analyzing;
