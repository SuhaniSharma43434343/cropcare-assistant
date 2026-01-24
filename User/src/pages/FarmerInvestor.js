import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChevronLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp,
  Briefcase,
  Sprout,
  DollarSign,
  Truck,
  UserCheck,
  AlertCircle,
  X
} from 'lucide-react';
import SidebarLayout from '../components/layout/SidebarLayout';
import AlertBell from '../components/alerts/AlertBell';

const FarmerInvestor = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSelectedOption(null);
    setSubmitted(false);
    setFormData({});
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setFormData({});
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'location':
        return !value?.trim() ? 'Location is required' : '';
      case 'contactMobile':
        return !value?.trim() ? 'Contact mobile is required' : 
               !/^[6-9]\d{9}$/.test(value) ? 'Enter valid 10-digit mobile number' : '';
      case 'machinery':
        return !value?.trim() ? 'Machinery type is required' : '';
      case 'duration':
        return !value || value < 1 ? 'Duration must be at least 1 day' : '';
      case 'amount':
        return !value || value <= 0 ? 'Amount must be greater than 0' : '';
      case 'equity':
        return !value || value < 0 || value > 100 ? 'Equity must be between 0-100%' : '';
      case 'startDate':
        return !value ? 'Start date is required' : '';
      case 'endDate':
        if (!value) return 'End date is required';
        if (formData.startDate && new Date(value) <= new Date(formData.startDate)) {
          return 'End date must be after start date';
        }
        return '';
      case 'dailyPayment':
        return !value || value <= 0 ? 'Daily payment must be greater than 0' : '';
      case 'inventory':
        return !value?.trim() ? 'Equipment list is required' : '';
      case 'minEquity':
        return !value || value < 0 || value > 100 ? 'Minimum equity must be between 0-100%' : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    newErrors.location = validateField('location', formData.location);
    newErrors.contactMobile = validateField('contactMobile', formData.contactMobile);
    
    if (selectedOption === 'Request for Machinery') {
      newErrors.machinery = validateField('machinery', formData.machinery);
      newErrors.duration = validateField('duration', formData.duration);
    }
    
    if (selectedOption === 'Request for Loan') {
      newErrors.amount = validateField('amount', formData.amount);
      newErrors.equity = validateField('equity', formData.equity);
    }
    
    if (selectedOption === 'Request for Labour') {
      newErrors.startDate = validateField('startDate', formData.startDate);
      newErrors.endDate = validateField('endDate', formData.endDate);
      newErrors.dailyPayment = validateField('dailyPayment', formData.dailyPayment);
      newErrors.workersNeeded = validateField('workersNeeded', formData.workersNeeded);
    }
    
    // Thekedar form validations
    if (selectedOption === 'Inventory Rent') {
      newErrors.location = validateField('location', formData.location);
      newErrors.inventory = validateField('inventory', formData.inventory);
      newErrors.contactMobile = validateField('contactMobile', formData.contactMobile);
    }
    
    if (selectedOption === 'Loan') {
      newErrors.amount = validateField('amount', formData.amount);
      newErrors.minEquity = validateField('minEquity', formData.minEquity);
      newErrors.location = validateField('location', formData.location);
      newErrors.contactMobile = validateField('contactMobile', formData.contactMobile);
    }
    
    // Filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== '')
    );
    
    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      // Validate form data
      if (!validateForm()) {
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/farmer-investor/farmer-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: selectedOption,
          ...formData
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`Server error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
        setSuccessMessage('Request submitted successfully!');
      } else {
        throw new Error(result.message || 'Failed to submit request');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderErrorMessage = () => {
    if (!errorMessage) return null;
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-800 text-sm font-medium">Error</p>
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
        <button 
          onClick={() => setErrorMessage('')}
          className="text-red-400 hover:text-red-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const renderSuccessMessage = () => {
    if (!successMessage) return null;
    return (
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-green-800 text-sm font-medium">Success</p>
          <p className="text-green-700 text-sm">{successMessage}</p>
        </div>
        <button 
          onClick={() => setSuccessMessage('')}
          className="text-green-400 hover:text-green-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const renderInputField = (field, label, type = 'text', placeholder = '', required = true) => {
    const hasError = errors[field];
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={formData[field] || ''}
          placeholder={placeholder}
          className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
            hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          onChange={(e) => handleInputChange(field, e.target.value)}
          onBlur={(e) => {
            const error = validateField(field, e.target.value);
            if (error) {
              setErrors(prev => ({ ...prev, [field]: error }));
            }
          }}
        />
        {hasError && (
          <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{hasError}</span>
          </p>
        )}
      </div>
    );
  };

  // Professional option configurations
  const farmerOptions = [
    {
      id: 'Request for Machinery',
      title: 'Request Machinery',
      description: 'Rent agricultural equipment and machinery',
      icon: Truck,
      color: 'emerald'
    },
    {
      id: 'Request for Labour',
      title: 'Request Labour',
      description: 'Find skilled agricultural workers',
      icon: UserCheck,
      color: 'emerald'
    },
    {
      id: 'Request for Loan',
      title: 'Request Funding',
      description: 'Secure financial support for farming',
      icon: DollarSign,
      color: 'emerald'
    }
  ];

  const thekedarsOptions = [
    {
      id: 'Inventory Rent',
      title: 'Provide Equipment',
      description: 'Rent out agricultural machinery and tools',
      icon: Truck,
      color: 'blue'
    },
    {
      id: 'Loan',
      title: 'Provide Funding',
      description: 'Invest in agricultural projects',
      icon: DollarSign,
      color: 'blue'
    }
  ];

  const renderFarmerOptions = () => (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <Sprout className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">किसान सेवा</h3>
        <p className="text-gray-600">What resources do you need for your farm?</p>
      </div>
      
      <div className="grid gap-4">
        {farmerOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className="group w-full p-6 bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <IconComponent className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {option.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderThekedarsOptions = () => (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thekedar</h3>
        <p className="text-gray-600">What resources can you provide to farmers?</p>
      </div>
      
      <div className="grid gap-4">
        {thekedarsOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className="group w-full p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {option.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderFarmerForm = () => {
    if (selectedOption === 'Request for Loan') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-3">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Funding Request</h3>
            <p className="text-gray-600 text-sm">Provide details about your funding needs</p>
          </div>
          
          <div className="space-y-4">
            {renderErrorMessage()}
            {renderSuccessMessage()}
            {renderInputField('amount', 'Loan Amount (₹)', 'number', 'Enter amount needed')}
            {renderInputField('location', 'Location', 'text', 'Your farm location')}
            {renderInputField('equity', 'Equity Offered (%)', 'number', 'Percentage of land equity (0-100)')}
            {renderInputField('contactMobile', 'Contact Mobile', 'tel', 'Your mobile number')}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white p-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Funding Request'
              )}
            </button>
          </div>
        </div>
      );
    }

    if (selectedOption === 'Request for Machinery') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-3">
              <Truck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Machinery Request</h3>
            <p className="text-gray-600 text-sm">Specify the equipment you need</p>
          </div>
          
          <div className="space-y-4">
            {renderErrorMessage()}
            {renderSuccessMessage()}
            {renderInputField('location', 'Location', 'text', 'Your farm location')}
            {renderInputField('machinery', 'Machinery Type', 'text', 'Type of machinery needed (e.g., Tractor, Harvester)')}
            {renderInputField('duration', 'Duration (Days)', 'number', 'How many days needed')}
            {renderInputField('contactMobile', 'Contact Mobile', 'tel', 'Your mobile number')}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white p-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Machinery Request'
              )}
            </button>
          </div>
        </div>
      );
    }

    if (selectedOption === 'Request for Labour') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-3">
              <UserCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Labour Request</h3>
            <p className="text-gray-600 text-sm">Find skilled workers for your farm</p>
          </div>
          
          <div className="space-y-4">
            {renderErrorMessage()}
            {renderSuccessMessage()}
            {renderInputField('location', 'Location', 'text', 'Your farm location')}
            {renderInputField('startDate', 'Start Date', 'date', '')}
            {renderInputField('endDate', 'End Date', 'date', '')}
            {renderInputField('workersNeeded', 'Number of Workers', 'number', 'How many workers needed')}
            {renderInputField('dailyPayment', 'Daily Payment (₹)', 'number', 'Payment per worker per day')}
            {renderInputField('contactMobile', 'Contact Mobile', 'tel', 'Your mobile number')}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white p-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Labour Request'
              )}
            </button>
          </div>
        </div>
      );
    }
  };

  const renderThekedarsForm = () => {
    if (selectedOption === 'Inventory Rent') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Equipment Rental</h3>
            <p className="text-gray-600 text-sm">List your available equipment for rent</p>
          </div>
          
          <div className="space-y-4">
            {renderErrorMessage()}
            {renderSuccessMessage()}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location || ''}
                placeholder="Equipment location"
                className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.location}</span>
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Equipment <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.inventory || ''}
                placeholder="List all equipment and machinery available for rent"
                className={`w-full p-4 border rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.inventory ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                onChange={(e) => handleInputChange('inventory', e.target.value)}
              />
              {errors.inventory && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.inventory}</span>
                </p>
              )}
            </div>
            {renderInputField('contactMobile', 'Contact Mobile', 'tel', 'Your mobile number')}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Equipment Offer'
              )}
            </button>
          </div>
        </div>
      );
    }

    if (selectedOption === 'Loan') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Investment Opportunity</h3>
            <p className="text-gray-600 text-sm">Provide funding to farmers</p>
          </div>
          
          <div className="space-y-4">
            {renderErrorMessage()}
            {renderSuccessMessage()}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.amount || ''}
                placeholder="Amount available to invest"
                className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.amount}</span>
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Equity Required (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.minEquity || ''}
                placeholder="Minimum equity percentage (0-100)"
                className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.minEquity ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                onChange={(e) => handleInputChange('minEquity', e.target.value)}
              />
              {errors.minEquity && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.minEquity}</span>
                </p>
              )}
            </div>
            {renderInputField('location', 'Preferred Location', 'text', 'Investment location preference')}
            {renderInputField('contactMobile', 'Contact Mobile', 'tel', 'Your mobile number')}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Investment Offer'
              )}
            </button>
          </div>
        </div>
      );
    }
  };

  const renderMatches = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Matching Requests</h3>
      </div>
      
      {matches.length > 0 ? (
        <div className="space-y-3">
          {matches.map((match, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h4 className="font-semibold text-gray-900">{match.type}</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Location:</span> {match.location}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Amount:</span> ₹{match.amount?.toLocaleString()}
                  </p>
                </div>
                <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No matching requests found at the moment</p>
          <p className="text-gray-400 text-sm mt-1">Check back later for new opportunities</p>
        </div>
      )}
    </div>
  );

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Professional Header - Fixed Layout */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            {/* Left side - Back button and Title */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">FarmConnect</h1>
              </div>
            </div>
            
            {/* Right side - Bell icon */}
            <div className="flex items-center">
              <AlertBell className="text-gray-600 hover:text-gray-800" />
            </div>
          </div>
        </div>

        <div className="p-4 max-w-2xl mx-auto pb-20 sm:pb-4">
          {!selectedRole ? (
            /* Professional Role Selection */
            <div className="space-y-8">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl mb-6">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Welcome to FarmConnect</h2>
                <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto">
                  Connecting किसान with thekedars to build a sustainable agricultural ecosystem
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Farmer Card */}
                <button
                  onClick={() => handleRoleSelect('farmer')}
                  className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-emerald-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 bg-emerald-100 rounded-2xl mb-4 group-hover:bg-emerald-200 transition-colors">
                      <Sprout className="w-7 sm:w-8 h-7 sm:h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      किसान
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">Request resources and support for your farming needs</p>
                    <div className="flex items-center justify-center space-x-2 text-emerald-600 group-hover:text-emerald-700">
                      <span className="text-sm font-medium">Get Started</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Thekedar Card */}
                <button
                  onClick={() => handleRoleSelect('thekedar')}
                  className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 transition-colors">
                      <TrendingUp className="w-7 sm:w-8 h-7 sm:h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                      Thekedar
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">Provide resources and invest in agricultural projects</p>
                    <div className="flex items-center justify-center space-x-2 text-blue-600 group-hover:text-blue-700">
                      <span className="text-sm font-medium">Get Started</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : submitted ? (
            /* Professional Success/Results */
            <div className="space-y-6">
              {selectedRole === 'farmer' ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-4">
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted Successfully!</h3>
                  <p className="text-gray-600 mb-6">Your request has been posted to our network of investors. You'll be notified when someone responds.</p>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <p className="text-yellow-800 text-sm font-medium">⏱️ Typically, investors respond within 24-48 hours</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Offer Posted Successfully!</h3>
                    <p className="text-gray-600">Your thekedar offer is now live. Here are matching requests:</p>
                  </div>
                  {renderMatches()}
                </div>
              )}
              
              <div className="text-center">
                <button
                  onClick={() => {
                    setSelectedRole(null);
                    setSelectedOption(null);
                    setSubmitted(false);
                    setFormData({});
                    setErrors({});
                    setSuccessMessage('');
                    setErrorMessage('');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Create New Request
                </button>
              </div>
            </div>
          ) : !selectedOption ? (
            /* Professional Option Selection */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedRole(null)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to role selection</span>
              </button>
              
              {selectedRole === 'farmer' ? renderFarmerOptions() : renderThekedarsOptions()}
            </div>
          ) : (
            /* Professional Forms */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedOption(null)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to options</span>
              </button>
              
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
                {selectedRole === 'farmer' ? renderFarmerForm() : renderThekedarsForm()}
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default FarmerInvestor;