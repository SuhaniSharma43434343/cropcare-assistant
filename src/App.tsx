import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ImageCapture from "./pages/ImageCapture";
import Analyzing from "./pages/Analyzing";
import Diagnosis from "./pages/Diagnosis";
import Treatment from "./pages/Treatment";
import VoiceAssistant from "./pages/VoiceAssistant";
import Dashboard from "./pages/Dashboard";
import DiseaseLibrary from "./pages/DiseaseLibrary";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/capture" element={<ImageCapture />} />
          <Route path="/analyzing" element={<Analyzing />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/treatment" element={<Treatment />} />
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<DiseaseLibrary />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
