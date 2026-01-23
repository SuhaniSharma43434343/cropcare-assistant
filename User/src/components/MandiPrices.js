import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, IndianRupee, MapPin, AlertCircle } from 'lucide-react';

const MandiPrices = ({ selectedCrop = 'Rice', location = null }) => {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(location);
  const [previousPrices, setPreviousPrices] = useState(null);

  const cropMapping = {
    'Rice': 'Rice',
    'Wheat': 'Wheat',
    'Tomato': 'Tomato',
    'Cotton': 'Cotton',
    'Onion': 'Onion',
    'Potato': 'Potato',
    'Corn': 'Maize',
    'Banana': 'Banana',
    'Apple': 'Apple',
    'Mango': 'Mango',
    'Grapes': 'Grapes',
    'Sugarcane': 'Sugarcane',
    'Tea': 'Tea',
    'Coffee': 'Coffee',
    'Okra': 'Okra',
    'Eggplant': 'Brinjal'
  };

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ lat: latitude, lon: longitude });
          },
          (error) => {
            reject(error);
          },
          { timeout: 10000 }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
      );
      const data = await response.json();
      return {
        state: data.address?.state,
        district: data.address?.state_district || data.address?.county,
        city: data.address?.city || data.address?.town || data.address?.village
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  const fetchMandiPrices = async () => {
    try {
      setLoading(true);
      
      // Use backend API instead of direct government API
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/mandi/prices?crop=${encodeURIComponent(selectedCrop)}&limit=10`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      const result = await response.json();
      
      if (result.success && result.data.records && result.data.records.length > 0) {
        setPrices({
          records: result.data.records,
          lastUpdated: result.data.lastUpdated,
          source: result.data.source
        });
        setError(null);
      } else {
        setError('No market data available');
      }
    } catch (err) {
      setError('Failed to fetch market prices');
      console.error('Mandi API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMandiPrices();
    const interval = setInterval(fetchMandiPrices, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, [selectedCrop, userLocation]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-green-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-green-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-green-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
        <div className="space-y-2">
          {[1,2].map(i => (
            <div key={i} className="bg-green-100 rounded p-2">
              <div className="h-3 bg-green-200 rounded animate-pulse mb-1"></div>
              <div className="h-2 bg-green-200 rounded animate-pulse w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !prices) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 h-full">
        <div className="flex items-center gap-3 text-gray-500">
          <AlertCircle className="w-8 h-8" />
          <div>
            <p className="font-medium">Market Prices Unavailable</p>
            <p className="text-sm">Service temporarily down</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <IndianRupee className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Market Prices</h3>
            <p className="text-xs text-gray-600">
              {prices?.source === 'government_api' ? 'Live Mandi Rates' : 'Sample Market Data'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          <span>{selectedCrop}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {prices.records.slice(0, 2).map((record, index) => {
          const price = record.modal_price || record.min_price || record.max_price || 'N/A';
          const commodity = record.commodity || 'Unknown';
          const market = record.market || record.district || 'Unknown';
          const change = Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : -(Math.floor(Math.random() * 10) + 1); // Simulated change
          
          return (
            <div key={index} className="bg-white rounded-lg p-3 border border-green-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-800 capitalize">
                  {commodity.length > 12 ? commodity.substring(0, 12) + '...' : commodity}
                </span>
                <div className="flex items-center gap-1 text-green-600">
                  {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                  <span className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {change > 0 ? '+' : ''}{change}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    {price !== 'N/A' ? price : '---'}
                  </span>
                  <span className="text-xs text-gray-500">/qtl</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {market.length > 8 ? market.substring(0, 8) + '...' : market}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-xs text-gray-500 mt-3 text-center">
        Updated: {new Date(prices.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default MandiPrices;