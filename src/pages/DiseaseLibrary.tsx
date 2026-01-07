import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Leaf, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/layout/MobileLayout";

const diseases = [
  {
    id: 1,
    name: "Late Blight",
    crops: ["Tomato", "Potato"],
    severity: "High",
    description: "Caused by Phytophthora infestans, spreads rapidly in cool, wet conditions.",
    color: "bg-destructive/10 text-destructive",
  },
  {
    id: 2,
    name: "Powdery Mildew",
    crops: ["Cucumber", "Squash", "Melon"],
    severity: "Medium",
    description: "White powdery coating on leaves, thrives in warm, humid conditions.",
    color: "bg-warning/10 text-warning",
  },
  {
    id: 3,
    name: "Bacterial Leaf Spot",
    crops: ["Pepper", "Tomato"],
    severity: "Medium",
    description: "Dark spots with yellow halos, spreads through water splash.",
    color: "bg-warning/10 text-warning",
  },
  {
    id: 4,
    name: "Root Rot",
    crops: ["Various"],
    severity: "High",
    description: "Fungal disease affecting roots, caused by overwatering.",
    color: "bg-destructive/10 text-destructive",
  },
  {
    id: 5,
    name: "Aphid Infestation",
    crops: ["Various"],
    severity: "Low",
    description: "Small insects that suck plant sap, causing curled leaves.",
    color: "bg-success/10 text-success",
  },
  {
    id: 6,
    name: "Fusarium Wilt",
    crops: ["Tomato", "Banana"],
    severity: "High",
    description: "Soil-borne fungus causing wilting and yellowing.",
    color: "bg-destructive/10 text-destructive",
  },
  {
    id: 7,
    name: "Downy Mildew",
    crops: ["Grapes", "Cucumber"],
    severity: "Medium",
    description: "Yellow patches on leaves with fuzzy growth underneath.",
    color: "bg-warning/10 text-warning",
  },
  {
    id: 8,
    name: "Anthracnose",
    crops: ["Mango", "Papaya", "Chili"],
    severity: "High",
    description: "Dark sunken lesions on fruits, leaves, and stems.",
    color: "bg-destructive/10 text-destructive",
  },
];

const cropFilters = ["All", "Tomato", "Potato", "Cucumber", "Pepper", "Mango"];
const severityFilters = ["All", "Low", "Medium", "High"];

const DiseaseLibrary = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");

  const filteredDiseases = diseases.filter((disease) => {
    const matchesSearch = disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCrop === "All" || disease.crops.includes(selectedCrop);
    const matchesSeverity = selectedSeverity === "All" || disease.severity === selectedSeverity;
    return matchesSearch && matchesCrop && matchesSeverity;
  });

  return (
    <MobileLayout>
      <div className="px-4 pt-6 safe-area-top">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-display font-bold text-foreground">Disease Library</h1>
          <p className="text-sm text-muted-foreground">Learn about common crop diseases</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diseases..."
              className="pl-10 h-12 rounded-xl bg-secondary border-0"
            />
          </div>
          <Button
            variant={showFilters ? "gradient" : "secondary"}
            size="icon-lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="glass-card rounded-2xl p-4 space-y-4">
                {/* Crop Filter */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Filter by Crop</p>
                  <div className="flex flex-wrap gap-2">
                    {cropFilters.map((crop) => (
                      <button
                        key={crop}
                        onClick={() => setSelectedCrop(crop)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedCrop === crop
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Severity Filter */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Filter by Severity</p>
                  <div className="flex gap-2">
                    {severityFilters.map((severity) => (
                      <button
                        key={severity}
                        onClick={() => setSelectedSeverity(severity)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedSeverity === severity
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {severity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCrop !== "All" || selectedSeverity !== "All") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCrop("All");
                      setSelectedSeverity("All");
                    }}
                    className="text-xs"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredDiseases.length} disease{filteredDiseases.length !== 1 ? "s" : ""} found
        </p>

        {/* Disease Cards */}
        <div className="space-y-3 pb-6">
          {filteredDiseases.map((disease, index) => (
            <motion.div
              key={disease.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card rounded-2xl p-4 shadow-card cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate("/diagnosis")}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-8 h-8 text-primary/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{disease.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${disease.color}`}>
                      {disease.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {disease.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Affects:</span>
                    <div className="flex gap-1 flex-wrap">
                      {disease.crops.slice(0, 3).map((crop) => (
                        <span
                          key={crop}
                          className="px-2 py-0.5 bg-secondary rounded-full text-xs text-secondary-foreground"
                        >
                          {crop}
                        </span>
                      ))}
                      {disease.crops.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{disease.crops.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default DiseaseLibrary;
