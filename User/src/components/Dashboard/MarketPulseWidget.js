import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const MarketPulseWidget = ({ marketData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Market Pulse</h3>
        <span className="text-xs text-gray-500">Data from APMC Mandi</span>
      </div>
      
      <div className="space-y-4">
        {marketData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900">{item.crop}</span>
                <div className="text-xs text-gray-500">Per Quintal</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">₹{item.price.toLocaleString()}</div>
              <div className="flex items-center space-x-1">
                {item.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 trend-up" />
                ) : (
                  <ArrowTrendingDownIcon className="h-3 w-3 text-red-500 trend-down" />
                )}
                <span className={`text-xs font-medium ${
                  item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium focus-ring rounded-md py-2">
          View All Market Rates →
        </button>
      </div>
    </div>
  );
};

export default MarketPulseWidget;