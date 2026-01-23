import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import MobileLayout from '../components/layout/MobileLayout';

const FarmerInvestor = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [matches, setMatches] = useState([]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSelectedOption(null);
    setSubmitted(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const endpoint = selectedRole === 'farmer' ? '/api/farmer-investor/farmer-request' : '/api/farmer-investor/investor-offer';
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedOption,
          ...formData
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (selectedRole === 'investor' && result.matches) {
          setMatches(result.matches);
        }
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const renderFarmerOptions = () => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-4">👨‍🌾 What do you need?</h3>
      {['Request for Machinery', 'Request for Labour', 'Request for Loan'].map((option) => (
        <button
          key={option}
          onClick={() => handleOptionSelect(option)}
          className="w-full p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{option}</span>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>
      ))}
    </div>
  );

  const renderInvestorOptions = () => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-4">💼 What can you provide?</h3>
      {['Inventory Rent', 'Loan'].map((option) => (
        <button
          key={option}
          onClick={() => handleOptionSelect(option)}
          className="w-full p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{option}</span>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>
      ))}
    </div>
  );

  const renderFarmerForm = () => {
    if (selectedOption === 'Request for Loan') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">💰 Loan Request</h3>
          <input
            type="number"
            placeholder="Loan amount needed (₹)"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('amount', e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
          <input
            type="text"
            placeholder="Equity offered on land (%)"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('equity', e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold"
          >
            Submit Request
          </button>
        </div>
      );
    }

    if (selectedOption === 'Request for Machinery') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🚜 Machinery Request</h3>
          <input
            type="text"
            placeholder="Location"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
          <input
            type="text"
            placeholder="Machinery needed"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('machinery', e.target.value)}
          />
          <input
            type="text"
            placeholder="Duration of use (days)"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('duration', e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold"
          >
            Submit Request
          </button>
        </div>
      );
    }

    if (selectedOption === 'Request for Labour') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">👷 Labour Request</h3>
          <input
            type="date"
            placeholder="Start date"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('startDate', e.target.value)}
          />
          <input
            type="date"
            placeholder="End date"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('endDate', e.target.value)}
          />
          <input
            type="number"
            placeholder="Daily payment amount (₹)"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('dailyPayment', e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold"
          >
            Submit Request
          </button>
        </div>
      );
    }
  };

  const renderInvestorForm = () => {
    if (selectedOption === 'Inventory Rent') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🏪 Inventory Available</h3>
          <input
            type="text"
            placeholder="Location"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
          <textarea
            placeholder="Inventory items available for rent"
            className="w-full p-3 border rounded-lg h-24"
            onChange={(e) => handleInputChange('inventory', e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
          >
            Submit Offer
          </button>
        </div>
      );
    }

    if (selectedOption === 'Loan') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">💳 Loan Available</h3>
          <input
            type="number"
            placeholder="Amount available to lend (₹)"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('amount', e.target.value)}
          />
          <input
            type="text"
            placeholder="Minimum equity required (%)"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('minEquity', e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
          >
            Submit Offer
          </button>
        </div>
      );
    }
  };

  const renderMatches = () => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">🎯 Matching Requests</h3>
      {matches.length > 0 ? (
        matches.map((match, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{match.type}</p>
                <p className="text-gray-600">{match.location}</p>
                <p className="text-sm text-gray-500">Amount: ₹{match.amount}</p>
              </div>
              <button className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">
                Connect
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-8">No matching requests found</p>
      )}
    </div>
  );

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 bg-white shadow-sm">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">🤝 FarmConnect</h1>
        </div>

        <div className="p-4">
          {!selectedRole ? (
            /* Role Selection */
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Choose Your Role</h2>
                <p className="text-gray-600">Connect farmers and investors</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect('farmer')}
                  className="bg-gradient-to-r from-green-400 to-green-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">👨‍🌾</div>
                    <h3 className="text-2xl font-bold">Farmer</h3>
                    <p className="text-green-100 mt-2">Request resources</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('investor')}
                  className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">💼</div>
                    <h3 className="text-2xl font-bold">Investor</h3>
                    <p className="text-blue-100 mt-2">Provide resources</p>
                  </div>
                </button>
              </div>
            </div>
          ) : submitted ? (
            /* Success/Results */
            <div className="text-center space-y-6">
              {selectedRole === 'farmer' ? (
                <div className="bg-white p-8 rounded-2xl">
                  <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Request Submitted!</h3>
                  <p className="text-gray-600">Waiting for investors to respond...</p>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-4">Offer Posted!</h3>
                  {renderMatches()}
                </div>
              )}
              
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setSelectedOption(null);
                  setSubmitted(false);
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg"
              >
                Start Over
              </button>
            </div>
          ) : !selectedOption ? (
            /* Option Selection */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedRole(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to role selection
              </button>
              
              {selectedRole === 'farmer' ? renderFarmerOptions() : renderInvestorOptions()}
            </div>
          ) : (
            /* Forms */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedOption(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to options
              </button>
              
              <div className="bg-white p-6 rounded-2xl">
                {selectedRole === 'farmer' ? renderFarmerForm() : renderInvestorForm()}
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default FarmerInvestor;