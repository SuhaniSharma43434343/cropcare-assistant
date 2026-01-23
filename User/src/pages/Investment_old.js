import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import MobileLayout from "../components/layout/MobileLayout";
import {
  Home,
  Camera,
  BarChart3,
  User,
  TrendingUp,
  MapPin,
  Leaf,
  DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Investment = () => {
  const navigate = useNavigate();
  const [borrowerForm, setBorrowerForm] = useState({
    farmerName: '',
    cropType: '',
    landSize: '',
    investmentNeeded: '',
    equityOffered: '',
    location: ''
  });

  const [filters, setFilters] = useState({
    cropType: '',
    location: '',
    equity: ''
  });

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      active: false
    },
    {
      icon: Camera,
      label: "Scan",
      path: "/capture",
      active: false
    },
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/dashboard",
      active: false
    },
    {
      icon: TrendingUp,
      label: "Investment",
      path: "/investment",
      active: true
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      active: false
    },
  ];

  const investmentOpportunities = [
    {
      id: 1,
      farmer: "Raju Patel",
      crop: "Tomato",
      land: "1 Acre",
      ask: "₹40,000",
      equity: "20%",
      location: "Anand",
      image: "/api/placeholder/300/200" // Placeholder image
    },
    {
      id: 2,
      farmer: "Priya Sharma",
      crop: "Wheat",
      land: "2 Acres",
      ask: "₹75,000",
      equity: "15%",
      location: "Jaipur",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      farmer: "Amit Kumar",
      crop: "Rice",
      land: "3 Acres",
      ask: "₹1,20,000",
      equity: "25%",
      location: "Patna",
      image: "/api/placeholder/300/200"
    }
  ];

  const handleBorrowerSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Borrower form submitted:', borrowerForm);
    alert('Investment request submitted successfully!');
  };

  const handleInterest = (opportunity) => {
    alert(`Interest shown for ${opportunity.farmer}'s ${opportunity.crop} farm`);
  };

  const Sidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1B8354]">CropCare AI</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                item.active
                  ? 'bg-[#1B8354] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-white flex">
        <Sidebar />

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Borrower Section */}
          <div className="flex-1 p-6 lg:border-r lg:border-gray-200">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto lg:mx-0"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Raise Capital</h2>
              <form onSubmit={handleBorrowerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farmer Name
                  </label>
                  <Input
                    type="text"
                    value={borrowerForm.farmerName}
                    onChange={(e) => setBorrowerForm({...borrowerForm, farmerName: e.target.value})}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Type
                  </label>
                  <Input
                    type="text"
                    value={borrowerForm.cropType}
                    onChange={(e) => setBorrowerForm({...borrowerForm, cropType: e.target.value})}
                    placeholder="e.g., Tomato, Wheat, Rice"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Land Size (Acres)
                  </label>
                  <Input
                    type="number"
                    value={borrowerForm.landSize}
                    onChange={(e) => setBorrowerForm({...borrowerForm, landSize: e.target.value})}
                    placeholder="Enter land size"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Needed (₹)
                  </label>
                  <Input
                    type="number"
                    value={borrowerForm.investmentNeeded}
                    onChange={(e) => setBorrowerForm({...borrowerForm, investmentNeeded: e.target.value})}
                    placeholder="Enter amount needed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equity Offered (%)
                  </label>
                  <Input
                    type="number"
                    value={borrowerForm.equityOffered}
                    onChange={(e) => setBorrowerForm({...borrowerForm, equityOffered: e.target.value})}
                    placeholder="Enter equity percentage"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={borrowerForm.location}
                    onChange={(e) => setBorrowerForm({...borrowerForm, location: e.target.value})}
                    placeholder="Enter location"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1B8354] hover:bg-[#166c46] text-white py-3 rounded-lg font-medium"
                >
                  Submit Request
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Investor Section */}
          <div className="flex-1 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Opportunities</h2>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <Leaf className="w-4 h-4 text-[#1B8354] mr-2" />
                  <Input
                    type="text"
                    placeholder="Crop Type"
                    value={filters.cropType}
                    onChange={(e) => setFilters({...filters, cropType: e.target.value})}
                    className="bg-transparent border-none p-0 focus:ring-0 text-sm"
                  />
                </div>

                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <MapPin className="w-4 h-4 text-[#1B8354] mr-2" />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="bg-transparent border-none p-0 focus:ring-0 text-sm"
                  />
                </div>

                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <DollarSign className="w-4 h-4 text-[#1B8354] mr-2" />
                  <Input
                    type="text"
                    placeholder="Equity %"
                    value={filters.equity}
                    onChange={(e) => setFilters({...filters, equity: e.target.value})}
                    className="bg-transparent border-none p-0 focus:ring-0 text-sm"
                  />
                </div>
              </div>

              {/* Investment Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {investmentOpportunities.map((opportunity) => (
                  <motion.div
                    key={opportunity.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + opportunity.id * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <Leaf className="w-12 h-12 text-[#1B8354]" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">Farmer: {opportunity.farmer}</h3>
                      <p className="text-sm text-gray-600">Crop: {opportunity.crop}</p>
                      <p className="text-sm text-gray-600">Land: {opportunity.land}</p>
                      <p className="text-sm text-gray-600">Ask: {opportunity.ask}</p>
                      <p className="text-sm text-gray-600">Equity: {opportunity.equity}</p>
                      <p className="text-sm text-gray-600">Loc: {opportunity.location}</p>
                    </div>

                    <Button
                      onClick={() => handleInterest(opportunity)}
                      variant="outline"
                      className="w-full mt-4 border-[#1B8354] text-[#1B8354] hover:bg-[#1B8354] hover:text-white"
                    >
                      I'm Interested
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Investment;