import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlertProvider } from "./components/alerts/AlertProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { CropProvider } from "./contexts/CropContext";
import AlertSystem from "./components/alerts/AlertSystem";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAlerts } from "./components/alerts/AlertProvider";
import DataCleanupService from "./services/dataCleanupService";
import Index from "./pages/Index";
import ImageCapture from "./pages/ImageCapture";
import Analyzing from "./pages/Analyzing";
import Diagnosis from "./pages/Diagnosis";
import Treatment from "./pages/Treatment";
import VoiceAssistant from "./pages/VoiceAssistant";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AlertDemo from "./pages/AlertDemo";

// Initialize data cleanup on app start
DataCleanupService.initialize();

const queryClient = new QueryClient();

const AppContent = () => {
  const { alerts, removeAlert } = useAlerts();
  
  return (
    <ProtectedRoute>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/capture" element={<ImageCapture />} />
          <Route path="/analyzing" element={<Analyzing />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/treatment" element={<Treatment />} />
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/alert-demo" element={<AlertDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <AlertSystem 
        alerts={alerts} 
        onDismiss={removeAlert}
        onAction={(alert, actionType) => {
          console.log('Alert action:', actionType, alert);
          // Handle alert actions here
        }}
      />
    </ProtectedRoute>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CropProvider>
          <AlertProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </AlertProvider>
        </CropProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;