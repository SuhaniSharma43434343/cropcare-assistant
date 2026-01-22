import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Search, 
  Filter,
  Leaf,
  AlertTriangle,
  Clock,
  Droplets,
  Shield,
  CheckCircle,
  X
} from "lucide-react";
import { Button } from "../components/ui/button";
import MobileLayout from "../components/layout/MobileLayout";
import { INDIAN_CROP_DISEASES } from "../data/diseaseDatabase";

const TreatmentPlans = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const crops = ["All", ...new Set(INDIAN_CROP_DISEASES.map(d => d.crop))];
  
  const filteredDiseases = INDIAN_CROP_DISEASES.filter(disease => {
    const matchesSearch = disease.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disease.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === "All" || disease.crop === selectedCrop;
    return matchesSearch && matchesCrop;
  });

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (selectedDisease) {
    return (
      <MobileLayout showNav={false}>
        <div className="min-h-screen bg-background safe-area-top">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDisease(null)}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-lg font-semibold">{selectedDisease.disease}</h1>
            <div className="w-10" />
          </div>

          <div className="px-4 py-4 max-w-4xl mx-auto">
            {/* Disease Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg mb-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{selectedDisease.disease}</h2>
                  <p className="text-gray-600 text-sm">{selectedDisease.diseaseHindi}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm text-gray-600">Crop: {selectedDisease.crop}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedDisease.severity)}`}>
                      {selectedDisease.severity} Risk
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Symptoms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Symptoms
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Early Symptoms</h4>
                  <ul className="space-y-1">
                    {selectedDisease.earlySymptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Advanced Symptoms</h4>
                  <ul className="space-y-1">
                    {selectedDisease.advancedSymptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Treatment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                Treatment Plan
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-medium text-green-800 mb-3">Organic Treatment</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Treatment:</strong> {selectedDisease.treatment.organic.name}</p>
                    <p><strong>Dosage:</strong> {selectedDisease.treatment.organic.dosage}</p>
                    <p><strong>Frequency:</strong> {selectedDisease.treatment.organic.frequency}</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-medium text-blue-800 mb-3">Chemical Treatment</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Chemical:</strong> {selectedDisease.treatment.chemical.name}</p>
                    <p><strong>Dosage:</strong> {selectedDisease.treatment.chemical.dosage}</p>
                    <p><strong>Frequency:</strong> {selectedDisease.treatment.chemical.frequency}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Application Details</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-700">
                  <p><strong>Best Time:</strong> {selectedDisease.bestTime}</p>
                  <p><strong>Recovery Time:</strong> {selectedDisease.recoveryTime}</p>
                </div>
              </div>
            </motion.div>

            {/* Prevention & Safety */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Prevention & Safety
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Do's</h4>
                  <ul className="space-y-1">
                    {selectedDisease.dos.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Don'ts</h4>
                  <ul className="space-y-1">
                    {selectedDisease.donts.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-red-50 rounded-xl">
                <p className="text-sm text-red-700">
                  <strong>Expert Consultation:</strong> {selectedDisease.expertConsult}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </MobileLayout>
    );
  }

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
          <h1 className="text-lg font-semibold">Treatment Plans</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-4 py-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search diseases or crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <h3 className="font-medium text-gray-800 mb-3">Filter by Crop</h3>
                <div className="flex flex-wrap gap-2">
                  {crops.map(crop => (
                    <button
                      key={crop}
                      onClick={() => setSelectedCrop(crop)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCrop === crop
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Disease List */}
          <div className="space-y-3">
            {filteredDiseases.map((disease, index) => (
              <motion.div
                key={disease.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedDisease(disease)}
                className="bg-white rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{disease.disease}</h3>
                    <p className="text-sm text-gray-600 mb-2">{disease.diseaseHindi}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">Crop: {disease.crop}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(disease.severity)}`}>
                        {disease.severity}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDiseases.length === 0 && (
            <div className="text-center py-12">
              <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No diseases found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default TreatmentPlans;