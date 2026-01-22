import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, IndianRupee } from 'lucide-react';

const CropRates = ({ city = 'Mumbai' }) => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/crop-rates/rates/${city}`);
      const data = await response.json();
      
      if (data.success) {
        setRates(data.data);
        setError(null);
      } else {
        setError('Rates unavailable');
      }
    } catch (err) {
      setError('Failed to fetch rates');
      console.error('Crop rates fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 600000);
    return () => clearInterval(interval);
  }, [city]);

  if (loading) {
    return (
      <div className="bg-green-50 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 bg-green-200 rounded animate-pulse w-20"></div>
          <div className="h-2 bg-green-200 rounded animate-pulse w-12"></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-green-100 rounded p-2">
              <div className="h-2 bg-green-200 rounded animate-pulse mb-1"></div>
              <div className="h-3 bg-green-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !rates) {
    return (
      <div className="bg-gray-50 rounded-xl p-3">
        <div className="flex items-center gap-2 text-gray-500">
          <IndianRupee className="w-4 h-4" />
          <span className="text-sm">Market rates unavailable</span>
        </div>
      </div>
    );
  }

  const topCrops = Object.entries(rates.rates).slice(0, 6);

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
          <IndianRupee className="w-4 h-4" />
          Market Rates
        </h3>
        <span className="text-xs text-gray-500">{rates.city}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {topCrops.slice(0, 4).map(([crop, data]) => {
          const TrendIcon = getTrendIcon(data.trend);
          const trendColor = getTrendColor(data.trend);
          
          return (
            <div key={crop} className="bg-white rounded-lg p-2 border border-green-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700 capitalize">{crop}</span>
                <div className={`flex items-center gap-1 ${trendColor}`}>
                  <TrendIcon className="w-3 h-3" />
                  <span className="text-xs">{data.change}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-gray-600" />
                <span className="text-sm font-semibold text-gray-900">{data.price}</span>
                <span className="text-xs text-gray-500">/{data.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-xs text-gray-500 mt-2 text-center">
        Updated: {new Date(rates.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default CropRates;