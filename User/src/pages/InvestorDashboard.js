import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  DollarSign, 
  UserCheck, 
  MapPin, 
  Calendar, 
  Phone,
  MessageCircle,
  Send,
  Filter,
  RefreshCw
} from 'lucide-react';
import SidebarLayout from '../components/layout/SidebarLayout';
import { Button } from '../components/ui/button';

const InvestorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/farmer-investor/requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        setRequests(result.requests);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (requestId) => {
    if (!responseMessage.trim()) {
      alert('Please enter a response message');
      return;
    }

    try {
      setSubmittingResponse(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/farmer-investor/respond/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: responseMessage,
          contactInfo: contactInfo || undefined
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Response sent successfully!');
        setSelectedRequest(null);
        setResponseMessage('');
        setContactInfo('');
        fetchRequests();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Response error:', error);
      alert('Failed to send response');
    } finally {
      setSubmittingResponse(false);
    }
  };

  const getRequestIcon = (type) => {
    switch (type) {
      case 'machinery': return Truck;
      case 'funding': return DollarSign;
      case 'labour': return UserCheck;
      default: return MessageCircle;
    }
  };

  const getRequestColor = (type) => {
    switch (type) {
      case 'machinery': return 'text-blue-600 bg-blue-100';
      case 'funding': return 'text-green-600 bg-green-100';
      case 'labour': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.requestType === filter;
  });

  if (loading) {
    return (
      <SidebarLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Investor Dashboard</h1>
          <p className="text-gray-600">Review and respond to farmer requests</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Requests' },
              { key: 'machinery', label: 'Machinery' },
              { key: 'funding', label: 'Funding' },
              { key: 'labour', label: 'Labour' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchRequests}
            className="ml-auto p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No requests found</p>
            </div>
          ) : (
            filteredRequests.map((request, index) => {
              const Icon = getRequestIcon(request.requestType);
              const colorClass = getRequestColor(request.requestType);
              
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)} Request
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            request.status === 'active' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">By {request.farmerName}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{request.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {request.requestType === 'machinery' && (
                            <>
                              <div>Machinery: {request.machineryType}</div>
                              <div>Duration: {request.duration} days</div>
                            </>
                          )}
                          
                          {request.requestType === 'funding' && (
                            <>
                              <div>Amount: ₹{request.amount?.toLocaleString()}</div>
                              <div>Equity: {request.equity}%</div>
                              {request.cropType && <div>Crop: {request.cropType}</div>}
                              {request.landSize && <div>Land: {request.landSize} acres</div>}
                            </>
                          )}
                          
                          {request.requestType === 'labour' && (
                            <>
                              <div>Start: {new Date(request.startDate).toLocaleDateString()}</div>
                              <div>End: {new Date(request.endDate).toLocaleDateString()}</div>
                              <div>Payment: ₹{request.dailyPayment}/day</div>
                              <div>Workers: {request.workersNeeded}</div>
                            </>
                          )}
                        </div>
                        
                        {request.description && (
                          <p className="mt-3 text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                            {request.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                          <Phone className="w-4 h-4" />
                          <span>{request.contactMobile}</span>
                          {request.responseCount > 0 && (
                            <span className="ml-4 text-blue-600">
                              {request.responseCount} response(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setSelectedRequest(request)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Respond
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Respond to {selectedRequest.farmerName}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response *
                  </label>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Write your response to the farmer..."
                    className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Information (Optional)
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Phone number or email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setSelectedRequest(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleRespond(selectedRequest.id)}
                    disabled={submittingResponse || !responseMessage.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  >
                    {submittingResponse ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Response
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default InvestorDashboard;