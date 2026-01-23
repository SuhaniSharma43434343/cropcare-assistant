import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  TrendingUp, 
  LogOut, 
  Filter, 
  MapPin, 
  Leaf, 
  DollarSign, 
  Phone,
  User,
  Calendar,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInvestorAuth } from '../contexts/InvestorAuthContext';
import investmentService from '../services/investmentService';

const InvestorDashboard = () => {
  const navigate = useNavigate();
  const { investor, token, logout } = useInvestorAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    cropType: '',
    location: '',
    minEquity: '',
    maxEquity: ''
  });

  useEffect(() => {
    if (!investor) {
      navigate('/investor-login');
      return;
    }
    fetchOpportunities();
  }, [investor, navigate]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await investmentService.getFarmerRequests(filters);
      
      if (response.success) {
        setOpportunities(response.data);
      } else {
        setError(response.message || 'Failed to fetch opportunities');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async (opportunity) => {
    try {
      const message = `Hi ${opportunity.farmerName}, I'm interested in investing in your ${opportunity.cropType} farming project. Let's discuss the details.`;
      
      const response = await investmentService.expressInterest(
        opportunity._id,
        message,
        token
      );
      
      if (response.success) {
        alert(`Interest expressed successfully! The farmer will be notified with your contact details.`);
        fetchOpportunities();
      } else {
        alert(response.message || 'Failed to express interest');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/investment');
  };

  const applyFilters = () => {
    fetchOpportunities();
  };

  const clearFilters = () => {
    setFilters({
      cropType: '',
      location: '',
      minEquity: '',
      maxEquity: ''
    });
    setTimeout(() => fetchOpportunities(), 100);
  };

  if (!investor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-[#1B8354] mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Investor Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {investor.name}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-[#1B8354] mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Opportunities</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crop Type
              </label>
              <div className="relative">
                <Leaf className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="e.g., Tomato, Wheat"
                  value={filters.cropType}
                  onChange={(e) => setFilters({...filters, cropType: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="e.g., Gujarat, Punjab"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Equity %
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Min %"
                  value={filters.minEquity}
                  onChange={(e) => setFilters({...filters, minEquity: e.target.value})}
                  className="pl-10"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Equity %
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Max %"
                  value={filters.maxEquity}
                  onChange={(e) => setFilters({...filters, maxEquity: e.target.value})}
                  className="pl-10"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={applyFilters}
              className="bg-[#1B8354] hover:bg-[#166c46] text-white"
            >
              Apply Filters
            </Button>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Investment Opportunities</h2>
            <div className="text-sm text-gray-600">
              {opportunities.length} opportunities found
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B8354] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading opportunities...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchOpportunities} variant="outline">
                Try Again
              </Button>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No investment opportunities found</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#1B8354] bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                      <Leaf className="w-6 h-6 text-[#1B8354]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{opportunity.farmerName}</h3>
                      <p className="text-sm text-gray-600">{opportunity.cropType}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{opportunity.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2" />
                      <span>{opportunity.landSize} Acres</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>₹{opportunity.investmentNeeded.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span>{opportunity.equityOffered}% Equity</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{opportunity.contactMobile}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Posted {new Date(opportunity.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {opportunity.description && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{opportunity.description}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      {opportunity.interestCount} interested
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>

                  <Button
                    onClick={() => handleInterest(opportunity)}
                    className="w-full bg-[#1B8354] hover:bg-[#166c46] text-white"
                  >
                    I'm Interested
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InvestorDashboard;