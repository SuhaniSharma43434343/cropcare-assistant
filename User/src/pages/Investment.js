import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
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
  DollarSign,
  Phone,
  Calendar,
  Target,
  Bell,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Filter,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import investmentService from "../services/investmentService";

const Investment = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [currentView, setCurrentView] = useState('selection'); // 'selection', 'farmer', 'investor'
  const [activeTab, setActiveTab] = useState('raise-capital');
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myInterests, setMyInterests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [farmerForm, setFarmerForm] = useState({
    farmerName: user?.name || '',
    cropType: '',
    landSize: '',
    investmentNeeded: '',
    equityOffered: '',
    taxRate: '',
    location: '',
    contactMobile: user?.phone || '',
    description: ''
  });

  const [filters, setFilters] = useState({
    cropType: '',
    location: '',
    minEquity: '',
    maxEquity: ''
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

  useEffect(() => {
    fetchOpportunities();
    if (user && token) {
      fetchMyRequests();
      fetchMyInterests();
    }
  }, [user, token]);

  const fetchOpportunities = async () => {
    try {
      const response = await investmentService.getFarmerRequests(filters);
      if (response.success) {
        setOpportunities(response.data);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const response = await investmentService.getMyRequests(token);
      if (response.success) {
        setMyRequests(response.data);
      }
    } catch (err) {
      console.error('Error fetching my requests:', err);
    }
  };

  const fetchMyInterests = async () => {
    try {
      const response = await investmentService.getMyInterests(token);
      if (response.success) {
        setMyInterests(response.data);
      }
    } catch (err) {
      console.error('Error fetching my interests:', err);
    }
  };

  // Memoized form change handler to prevent re-renders
  const handleFormChange = useCallback((field, value) => {
    setFarmerForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // Memoized filter change handler to prevent re-renders
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFarmerSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      setError('Please login to submit a request');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await investmentService.createFarmerRequest(farmerForm, token);
      
      if (response.success) {
        setSuccess('Investment request submitted successfully! Redirecting to investor dashboard...');
        setFarmerForm({
          farmerName: user?.name || '',
          cropType: '',
          landSize: '',
          investmentNeeded: '',
          equityOffered: '',
          taxRate: '',
          location: '',
          contactMobile: user?.phone || '',
          description: ''
        });
        
        // Refresh data and redirect to investor view
        await fetchOpportunities();
        await fetchMyRequests();
        
        setTimeout(() => {
          setCurrentView('investor');
          setActiveTab('opportunities');
        }, 1500);
      } else {
        setError(response.message || 'Failed to submit request');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async (opportunityId) => {
    if (!user || !token) {
      setError('Please login as an investor to express interest');
      return;
    }
    
    try {
      const response = await investmentService.expressInterest(opportunityId, token);
      
      if (response.success) {
        setSuccess('Interest expressed successfully! The farmer will be notified.');
        fetchOpportunities();
      } else {
        setError(response.message || 'Failed to express interest');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleInterestStatusUpdate = async (interestId, status) => {
    try {
      const response = await investmentService.updateInterestStatus(interestId, status, token);
      
      if (response.success) {
        alert(`Interest ${status} successfully!`);
        fetchMyInterests();
      } else {
        alert(response.message || 'Failed to update status');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
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

  // Initial Selection Screen
  const SelectionScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Platform</h1>
          <p className="text-lg text-gray-600">Choose your role to get started</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Farmer Box */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setCurrentView('farmer')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-200 group"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🌾
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Farmer</h3>
              <p className="text-gray-600 mb-6">Raise capital for your farming projects and connect with investors</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <Target className="w-4 h-4 mr-2" />
                  <span>Create funding requests</span>
                </div>
                <div className="flex items-center justify-center">
                  <Bell className="w-4 h-4 mr-2" />
                  <span>Get investor notifications</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Investor Box */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => setCurrentView('investor')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 group"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                💼
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Investor</h3>
              <p className="text-gray-600 mb-6">Discover investment opportunities in agriculture and connect with farmers</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <Search className="w-4 h-4 mr-2" />
                  <span>Browse opportunities</span>
                </div>
                <div className="flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>Track investments</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  // Farmer Flow
  const FarmerFlow = () => (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-white flex">
        <Sidebar />
        <div className="flex-1 p-6">
          {/* Header with Back Button */}
          <div className="flex items-center mb-6">
            <Button
              onClick={() => setCurrentView('selection')}
              variant="ghost"
              className="mr-4 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('raise-capital')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'raise-capital' ? 'bg-white text-[#1B8354] shadow-sm' : 'text-gray-600'
              }`}
            >
              Raise Capital
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors relative ${
                activeTab === 'notifications' ? 'bg-white text-[#1B8354] shadow-sm' : 'text-gray-600'
              }`}
            >
              Notifications
              {myInterests.filter(i => i.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {myInterests.filter(i => i.status === 'pending').length}
                </span>
              )}
            </button>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {activeTab === 'raise-capital' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Create Investment Request</h2>
                
                <form onSubmit={handleFarmerSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Farmer Name *
                      </label>
                      <Input
                        type="text"
                        value={farmerForm.farmerName}
                        onChange={(e) => handleFormChange('farmerName', e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Crop Type *
                      </label>
                      <Input
                        type="text"
                        value={farmerForm.cropType}
                        onChange={(e) => handleFormChange('cropType', e.target.value)}
                        placeholder="e.g., Tomato, Wheat, Rice"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Land Size (Acres) *
                      </label>
                      <Input
                        type="number"
                        value={farmerForm.landSize}
                        onChange={(e) => handleFormChange('landSize', e.target.value)}
                        placeholder="Enter land size"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Investment Needed (₹) *
                      </label>
                      <Input
                        type="number"
                        value={farmerForm.investmentNeeded}
                        onChange={(e) => handleFormChange('investmentNeeded', e.target.value)}
                        placeholder="Enter amount needed"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Equity Offered (%) *
                      </label>
                      <Input
                        type="number"
                        value={farmerForm.equityOffered}
                        onChange={(e) => handleFormChange('equityOffered', e.target.value)}
                        placeholder="Enter equity percentage"
                        min="0"
                        max="100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Rate (%) *
                      </label>
                      <Input
                        type="number"
                        value={farmerForm.taxRate}
                        onChange={(e) => handleFormChange('taxRate', e.target.value)}
                        placeholder="Enter applicable tax rate"
                        min="0"
                        max="50"
                        step="0.1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <Input
                        type="text"
                        value={farmerForm.location}
                        onChange={(e) => handleFormChange('location', e.target.value)}
                        placeholder="Enter location"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Mobile *
                    </label>
                    <Input
                      type="tel"
                      value={farmerForm.contactMobile}
                      onChange={(e) => handleFormChange('contactMobile', e.target.value)}
                      placeholder="Enter contact number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Description
                    </label>
                    <textarea
                      value={farmerForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="Describe your farming project, experience, goals, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B8354] focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1B8354] hover:bg-[#166c46] text-white py-3 rounded-lg font-medium"
                  >
                    {loading ? 'Submitting...' : 'Submit Investment Request'}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Investor Notifications</h2>
              
              {myInterests.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No investor interests yet</p>
                  <p className="text-sm text-gray-500 mt-2">When investors show interest in your projects, you'll see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myInterests.map((interest) => (
                    <div key={interest._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {interest.investorId.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Interested in your {interest.farmerRequestId.cropType} project
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          interest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          interest.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {interest.status.charAt(0).toUpperCase() + interest.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Contact Details:</p>
                        <p className="text-sm">📧 {interest.investorId.email}</p>
                        <p className="text-sm">📱 {interest.investorId.phone}</p>
                      </div>
                      
                      {interest.message && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-1">Message:</p>
                          <p className="text-sm text-blue-800">{interest.message}</p>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-600 mb-4">
                        📅 Received: {new Date(interest.createdAt).toLocaleDateString()}
                      </div>
                      
                      {interest.status === 'pending' && (
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleInterestStatusUpdate(interest._id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Interest
                          </Button>
                          <Button
                            onClick={() => handleInterestStatusUpdate(interest._id, 'rejected')}
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50 flex items-center"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </MobileLayout>
  );

  // Investor Flow
  const InvestorFlow = () => (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-white flex">
        <Sidebar />
        <div className="flex-1 p-6">
          {/* Header with Back Button */}
          <div className="flex items-center mb-6">
            <Button
              onClick={() => setCurrentView('selection')}
              variant="ghost"
              className="mr-4 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Investor Dashboard</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'opportunities' ? 'bg-white text-[#1B8354] shadow-sm' : 'text-gray-600'
              }`}
            >
              Opportunities
            </button>
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'my-requests' ? 'bg-white text-[#1B8354] shadow-sm' : 'text-gray-600'
              }`}
            >
              My Requests
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'notifications' ? 'bg-white text-[#1B8354] shadow-sm' : 'text-gray-600'
              }`}
            >
              Notifications
            </button>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {activeTab === 'opportunities' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Investment Opportunities</h2>

              {/* Filters */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="flex items-center bg-white rounded-lg px-4 py-2">
                    <Leaf className="w-4 h-4 text-[#1B8354] mr-2" />
                    <Input
                      type="text"
                      placeholder="Crop Type"
                      value={filters.cropType}
                      onChange={(e) => handleFilterChange('cropType', e.target.value)}
                      className="bg-transparent border-none p-0 focus:ring-0 text-sm"
                    />
                  </div>

                  <div className="flex items-center bg-white rounded-lg px-4 py-2">
                    <MapPin className="w-4 h-4 text-[#1B8354] mr-2" />
                    <Input
                      type="text"
                      placeholder="Location"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="bg-transparent border-none p-0 focus:ring-0 text-sm"
                    />
                  </div>

                  <div className="flex items-center bg-white rounded-lg px-4 py-2">
                    <DollarSign className="w-4 h-4 text-[#1B8354] mr-2" />
                    <Input
                      type="number"
                      placeholder="Min Equity %"
                      value={filters.minEquity}
                      onChange={(e) => handleFilterChange('minEquity', e.target.value)}
                      className="bg-transparent border-none p-0 focus:ring-0 text-sm"
                    />
                  </div>

                  <div className="flex items-center bg-white rounded-lg px-4 py-2">
                    <DollarSign className="w-4 h-4 text-[#1B8354] mr-2" />
                    <Input
                      type="number"
                      placeholder="Max Equity %"
                      value={filters.maxEquity}
                      onChange={(e) => handleFilterChange('maxEquity', e.target.value)}
                      className="bg-transparent border-none p-0 focus:ring-0 text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={applyFilters} size="sm" className="bg-[#1B8354] hover:bg-[#166c46] text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                  <Button onClick={clearFilters} size="sm" variant="outline">
                    Clear
                  </Button>
                </div>
              </div>

              {/* Investment Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {opportunities.map((opportunity) => (
                  <motion.div
                    key={opportunity._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-[#1B8354] bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-2xl">🌾</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{opportunity.farmerName}</h3>
                        <p className="text-sm text-gray-600">{opportunity.cropType}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-[#1B8354]" />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Target className="w-4 h-4 mr-2 text-[#1B8354]" />
                        <span>{opportunity.landSize} Acres</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-[#1B8354]" />
                        <span>₹{opportunity.investmentNeeded.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-2 text-[#1B8354]" />
                        <span>{opportunity.equityOffered}% Equity</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-[#1B8354]" />
                        <span>{opportunity.taxRate}% Tax Rate</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-[#1B8354]" />
                        <span>{opportunity.contactMobile}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-[#1B8354]" />
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
                        👥 {opportunity.interestCount || 0} interested
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Active
                      </span>
                    </div>

                    <Button
                      onClick={() => handleExpressInterest(opportunity._id)}
                      className="w-full bg-[#1B8354] hover:bg-[#166c46] text-white"
                    >
                      💼 I'm Interested
                    </Button>
                  </motion.div>
                ))}
              </div>

              {opportunities.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No investment opportunities found</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or check back later</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'my-requests' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Investment Interests</h2>
              
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Your investment interests will appear here</p>
                <p className="text-sm text-gray-500 mt-2">Express interest in farming opportunities to track them here</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>
              
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No notifications yet</p>
                <p className="text-sm text-gray-500 mt-2">You'll receive notifications when farmers respond to your interests</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </MobileLayout>
  );

  // Main render logic
  if (currentView === 'selection') {
    return <SelectionScreen />;
  } else if (currentView === 'farmer') {
    return <FarmerFlow />;
  } else if (currentView === 'investor') {
    return <InvestorFlow />;
  }

  return <SelectionScreen />;
};

export default Investment;