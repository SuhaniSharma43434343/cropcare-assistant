import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AlertProvider } from "./components/alerts/AlertProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CropProvider } from "./contexts/CropContext";
import { DiseaseProvider } from "./contexts/DiseaseContext";
import AlertSystem from "./components/alerts/AlertSystem";
import AuthPage from "./components/auth/AuthPage";
import ReminderAlert from "./components/reminders/ReminderAlert";
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
import TreatmentPlans from "./pages/TreatmentPlans";
import MarketRates from "./pages/MarketRates";
import FarmerInvestor from "./pages/FarmerInvestor";
import InvestorDashboard from "./pages/InvestorDashboard";

// Initialize data cleanup on app start
DataCleanupService.initialize();

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">CropCare AI</h2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Root redirect component
const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />;
};

const AppContent = () => {
  const { alerts, removeAlert } = useAlerts();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<RootRedirect />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/capture" element={
          <ProtectedRoute>
            <ImageCapture />
          </ProtectedRoute>
        } />
        <Route path="/analyzing" element={
          <ProtectedRoute>
            <Analyzing />
          </ProtectedRoute>
        } />
        <Route path="/diagnosis" element={
          <ProtectedRoute>
            <Diagnosis />
          </ProtectedRoute>
        } />
        <Route path="/treatment" element={
          <ProtectedRoute>
            <Treatment />
          </ProtectedRoute>
        } />
        <Route path="/voice" element={
          <ProtectedRoute>
            <VoiceAssistant />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/treatment-plans" element={
          <ProtectedRoute>
            <TreatmentPlans />
          </ProtectedRoute>
        } />
        <Route path="/market-rates" element={
          <ProtectedRoute>
            <MarketRates />
          </ProtectedRoute>
        } />
        <Route path="/farm-connect" element={
          <ProtectedRoute>
            <FarmerInvestor />
          </ProtectedRoute>
        } />
        <Route path="/investor-dashboard" element={
          <ProtectedRoute>
            <InvestorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/alert-demo" element={
          <ProtectedRoute>
            <AlertDemo />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AlertSystem 
        alerts={alerts} 
        onDismiss={removeAlert}
        onAction={(alert, actionType) => {
          console.log('Alert action:', actionType, alert);
        }}
      />
      <ReminderAlert />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CropProvider>
          <DiseaseProvider>
            <AlertProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </AlertProvider>
          </DiseaseProvider>
        </CropProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;