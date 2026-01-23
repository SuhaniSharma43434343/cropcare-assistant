import React from 'react';
import { 
  HandshakeIcon, 
  CurrencyRupeeIcon, 
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const InvestmentTicker = ({ investmentData }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'new':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'new':
        return <TrendingUpIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <HandshakeIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 dashboard-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HandshakeIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Investment Opportunities</h3>
            <p className="text-sm text-gray-600">Funding requests and partnership offers</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium focus-ring rounded-md px-3 py-1">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {investmentData.map((investment, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(investment.status)}
                <span className="font-medium text-gray-900">{investment.title}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(investment.status)}`}>
                {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>{investment.description}</span>
              <div className="flex items-center">
                <CurrencyRupeeIcon className="h-4 w-4" />
                <span className="font-semibold">{investment.amount.toLocaleString()}</span>
              </div>
            </div>
            
            {investment.offers > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">
                  {investment.offers} offer{investment.offers > 1 ? 's' : ''} received
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium focus-ring rounded px-2 py-1">
                  Review →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dashboard-transition focus-ring">
          Create New Investment Request
        </button>
      </div>
    </div>
  );
};

export default InvestmentTicker;